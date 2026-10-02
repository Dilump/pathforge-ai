/**
 * PathForge AI - Quiz Service
 * Handles assessment generation, submission scoring, skill mastery updating,
 * and feeds data into the adaptive learning engine.
 * 
 * FUTURE AWS ARCHITECTURE NOTE:
 * In production on AWS, assessments will be scored by an AWS Lambda function,
 * storing audit logs and results in Amazon DynamoDB (AssessmentsTable) and
 * firing Amazon EventBridge events to trigger CloudWatch metrics and Bedrock analysis.
 */

import { storageService } from './storageService';
import { aiService } from './aiService';
import { roadmapService } from './roadmapService';

export const quizService = {
  /**
   * Retrieves or dynamically generates a 5-question multiple choice assessment
   */
  async getQuizForMission(mission) {
    if (!mission) throw new Error('Mission is required to generate assessment');
    const topic = mission.title;
    return aiService.generateQuiz(topic, mission.difficulty);
  },

  /**
   * Evaluates user's answers, calculates score, updates skill mastery,
   * stores assessment record, and invokes the adaptive roadmap engine.
   */
  async submitAssessment(mission, questions, userAnswers) {
    let correctCount = 0;
    const strengths = [];
    const weaknesses = [];

    questions.forEach((q, idx) => {
      const selectedIndex = userAnswers[idx];
      const isCorrect = selectedIndex === q.correctIndex;
      if (isCorrect) {
        correctCount += 1;
        strengths.push(q.concept || `Question ${idx + 1}`);
      } else {
        weaknesses.push(q.concept || `Question ${idx + 1}`);
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const assessmentId = `assessment-${mission.id}-${Date.now()}`;

    const assessmentResult = {
      id: assessmentId,
      missionId: mission.id,
      title: `${mission.title} Assessment`,
      topic: mission.skills?.[0] || mission.title,
      score,
      totalQuestions: questions.length,
      correctCount,
      completedAt: new Date().toISOString(),
      strengths: strengths.length ? strengths : ['General Understanding'],
      weaknesses: weaknesses.length ? weaknesses : ['None detected - flawless performance'],
      status: score >= 80 ? 'mastered' : score >= 60 ? 'passed' : 'needs-reinforcement',
      skillImpact: score >= 80 ? '+20% Mastery' : score >= 60 ? '+10% Mastery' : 'Reinforcement Triggered',
    };

    // Save assessment to storage
    storageService.saveAssessment(assessmentResult);

    // Update skill mastery
    const skills = storageService.getSkills();
    const primarySkillName = mission.skills?.[0];
    const skillIdx = skills.findIndex((s) => s.name.toLowerCase() === primarySkillName?.toLowerCase());
    
    if (skillIdx >= 0) {
      const currentMastery = skills[skillIdx].mastery || 30;
      let newMastery;
      if (score >= 80) {
        newMastery = Math.min(100, currentMastery + 20);
      } else if (score >= 60) {
        newMastery = Math.min(100, currentMastery + 10);
      } else {
        newMastery = Math.max(10, currentMastery - 5);
      }

      skills[skillIdx] = {
        ...skills[skillIdx],
        mastery: newMastery,
        quizScore: score,
        status: newMastery >= 70 ? 'strong' : newMastery >= 40 ? 'developing' : 'needs-attention',
      };
      storageService.saveSkills(skills);
    }

    // Trigger adaptive roadmap check
    const adaptation = await roadmapService.adaptRoadmapWithAssessment(assessmentResult, mission);

    // Update user stats
    const user = storageService.getUser();
    if (user) {
      const allAssessments = storageService.getAssessments();
      const avgScore = Math.round(
        allAssessments.reduce((acc, a) => acc + a.score, 0) / allAssessments.length
      );
      user.stats = {
        ...user.stats,
        averageQuizScore: avgScore,
        learningHours: Math.round(((user.stats.learningHours || 14) + 1.5) * 10) / 10,
      };
      storageService.saveUser(user);
    }

    // Log activity
    storageService.addActivity({
      type: 'assessment_complete',
      text: `Scored ${score}% on ${assessmentResult.title}`,
      icon: 'Award',
    });

    return {
      assessment: assessmentResult,
      adaptation,
    };
  },

  /**
   * Get all past assessment records
   */
  async getAssessmentHistory() {
    return storageService.getAssessments();
  },
};
