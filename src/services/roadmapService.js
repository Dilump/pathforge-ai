/**
 * PathForge AI - Roadmap Service
 * Coordinates roadmap milestones, mission task progress, and adaptive updates.
 * 
 * FUTURE AWS ARCHITECTURE NOTE:
 * In production on AWS, these operations map to RESTful API endpoints hosted
 * on Amazon API Gateway, which execute AWS Lambda functions writing state
 * into Amazon DynamoDB tables (Roadmaps and Missions).
 */

import { storageService } from './storageService';
import { aiService } from './aiService';

export const roadmapService = {
  /**
   * Get the full roadmap state
   */
  async getRoadmap() {
    return storageService.getRoadmap();
  },

  /**
   * Get all missions for the current roadmap
   */
  async getMissions() {
    return storageService.getMissions();
  },

  /**
   * Get a single mission by ID
   */
  async getMissionById(missionId) {
    const missions = storageService.getMissions();
    return missions.find((m) => m.id === missionId) || null;
  },

  /**
   * Toggle a task's completion status within a mission
   */
  async toggleTask(missionId, taskId) {
    const missions = storageService.getMissions();
    const mission = missions.find((m) => m.id === missionId);
    if (!mission) throw new Error('Mission not found');

    const updatedTasks = mission.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );

    const completedTasksCount = updatedTasks.filter((t) => t.completed).length;
    const progress = Math.round((completedTasksCount / updatedTasks.length) * 100);

    const updatedMission = {
      ...mission,
      tasks: updatedTasks,
      progress,
    };

    storageService.updateMission(missionId, updatedMission);

    // Update overall user progress
    this.recalculateOverallProgress();

    // Log activity if completed
    const toggledTask = updatedTasks.find((t) => t.id === taskId);
    if (toggledTask && toggledTask.completed) {
      storageService.addActivity({
        type: 'task_complete',
        text: `Completed task: ${toggledTask.title.slice(0, 45)}...`,
        icon: 'CheckCircle2',
      });
    }

    return updatedMission;
  },

  /**
   * Mark practical challenge complete
   */
  async toggleChallenge(missionId) {
    const mission = await this.getMissionById(missionId);
    if (!mission || !mission.challenge) return null;

    const newCompleted = !mission.challenge.completed;
    const updatedMission = {
      ...mission,
      challenge: {
        ...mission.challenge,
        completed: newCompleted,
      },
    };

    storageService.updateMission(missionId, updatedMission);
    this.recalculateOverallProgress();

    if (newCompleted) {
      storageService.addActivity({
        type: 'challenge_complete',
        text: `Finished challenge for ${mission.title}`,
        icon: 'Sparkles',
      });
    }

    return updatedMission;
  },

  /**
   * Generates a fresh roadmap for a newly onboarded user
   */
  async generateAndSaveUserRoadmap(profile, skillsBaseline) {
    // 1. Analyze skill gaps
    const skillGapAnalysis = await aiService.generateSkillGapAnalysis(profile, skillsBaseline);
    storageService.saveSkillGapAnalysis(skillGapAnalysis);
    storageService.saveSkills(skillGapAnalysis.skills);

    // 2. Generate roadmap
    const roadmapData = await aiService.generateRoadmap(profile, skillGapAnalysis);
    storageService.saveRoadmap(roadmapData);
    storageService.saveMissions(roadmapData.missions);

    // 3. Update user profile
    const updatedUser = {
      ...profile,
      onboardingComplete: true,
      stats: {
        overallProgress: 0,
        missionsCompleted: 0,
        totalMissions: roadmapData.missions.length,
        averageQuizScore: 0,
        learningHours: 0,
        currentStreak: 1,
      },
    };
    storageService.saveUser(updatedUser);

    storageService.addActivity({
      type: 'roadmap_generated',
      text: `Personalized ${skillGapAnalysis.targetCareer} roadmap forged by AI`,
      icon: 'Compass',
    });

    return { roadmap: roadmapData, skillGapAnalysis };
  },

  /**
   * Adapt the roadmap based on an assessment evaluation
   */
  async adaptRoadmapWithAssessment(assessmentResult, mission) {
    const currentMissions = storageService.getMissions();
    const adaptation = await aiService.adaptRoadmap(currentMissions, assessmentResult, mission);

    // Save updated missions list
    storageService.saveMissions(adaptation.newMissions);

    // Update roadmap object
    const roadmap = storageService.getRoadmap() || {};
    storageService.saveRoadmap({
      ...roadmap,
      lastAdapted: new Date().toISOString(),
      adaptationReason: adaptation.reason,
    });

    // Recalculate progress
    this.recalculateOverallProgress();

    if (adaptation.isAdapted) {
      storageService.addActivity({
        type: 'roadmap_adapted',
        text: `Roadmap adapted: Inserted remediation challenge for ${mission.title}`,
        icon: 'AlertCircle',
      });
    }

    return adaptation;
  },

  /**
   * Recalculates and updates overall progress metric
   */
  recalculateOverallProgress() {
    const missions = storageService.getMissions();
    if (!missions.length) return 0;

    const completedMissions = missions.filter((m) => m.status === 'completed').length;
    const currentMission = missions.find((m) => m.status === 'current');
    const currentProgress = currentMission ? (currentMission.progress / 100) : 0;

    const overall = Math.min(100, Math.round(((completedMissions + currentProgress) / missions.length) * 100));

    const user = storageService.getUser();
    if (user) {
      user.stats = {
        ...user.stats,
        overallProgress: overall,
        missionsCompleted: completedMissions,
        totalMissions: missions.length,
      };
      storageService.saveUser(user);
    }

    return overall;
  },
};
