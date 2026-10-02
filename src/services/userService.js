/**
 * PathForge AI - User Service
 * Manages user profile attributes, learning preferences, and stats.
 * 
 * FUTURE AWS ARCHITECTURE NOTE:
 * In production on AWS, profile operations will synchronize with Amazon Cognito
 * user attributes and Amazon DynamoDB User records via API Gateway and Lambda.
 */

import { storageService } from './storageService';
import { authService } from './authService';

export const userService = {
  /**
   * Get user profile
   */
  async getUserProfile() {
    return storageService.getUser();
  },

  /**
   * Update profile preferences (learning style, weekly hours, duration, name)
   */
  async updateProfile(updates) {
    return authService.updateUser(updates);
  },

  /**
   * Reset career path (requires new onboarding/roadmap generation)
   */
  async resetCareerGoal(newCareerGoal) {
    const user = storageService.getUser();
    if (!user) throw new Error('No active user session');

    const updated = {
      ...user,
      careerGoal: newCareerGoal,
      onboardingComplete: false,
      stats: {
        overallProgress: 0,
        missionsCompleted: 0,
        totalMissions: user.roadmapDuration || 8,
        averageQuizScore: 0,
        learningHours: 0,
        currentStreak: 1,
      },
    };

    storageService.saveUser(updated);
    storageService.saveRoadmap(null);
    storageService.saveMissions([]);
    storageService.saveSkills([]);
    storageService.saveSkillGapAnalysis(null);

    storageService.addActivity({
      type: 'career_reset',
      text: `Reset target career path to explore new roadmap`,
      icon: 'RefreshCw',
    });

    return updated;
  },

  /**
   * Reset demo data to initial state
   */
  async reloadDemoData() {
    return storageService.loadDemoState();
  },
};
