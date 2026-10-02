/**
 * PathForge AI - Storage Service
 * Centralizes all local persistence operations.
 * 
 * FUTURE AWS ARCHITECTURE NOTE:
 * In production on AWS, this local storage layer will be replaced with
 * Amazon API Gateway REST endpoints invoking AWS Lambda functions that persist
 * and query records from Amazon DynamoDB (e.g. UsersTable, RoadmapsTable, AssessmentsTable).
 */

import { DEMO_USER, DEMO_SKILLS, DEMO_MISSIONS, DEMO_ASSESSMENTS, DEMO_ACTIVITIES } from '../data/demoData';

const KEYS = {
  USER: 'pathforge_user',
  ROADMAP: 'pathforge_roadmap',
  SKILLS: 'pathforge_skills',
  MISSIONS: 'pathforge_missions',
  ASSESSMENTS: 'pathforge_assessments',
  ACTIVITIES: 'pathforge_activities',
  SKILL_GAP: 'pathforge_skill_gap',
};

const safeJsonParse = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`[storageService] Error parsing key ${key}:`, err);
    return fallback;
  }
};

const safeJsonSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`[storageService] Error writing key ${key}:`, err);
  }
};

export const storageService = {
  // User Profile
  getUser() {
    return safeJsonParse(KEYS.USER, null);
  },
  saveUser(user) {
    safeJsonSet(KEYS.USER, user);
    return user;
  },
  removeUser() {
    localStorage.removeItem(KEYS.USER);
  },

  // Roadmap
  getRoadmap() {
    return safeJsonParse(KEYS.ROADMAP, null);
  },
  saveRoadmap(roadmap) {
    safeJsonSet(KEYS.ROADMAP, roadmap);
    return roadmap;
  },

  // Skills
  getSkills() {
    return safeJsonParse(KEYS.SKILLS, []);
  },
  saveSkills(skills) {
    safeJsonSet(KEYS.SKILLS, skills);
    return skills;
  },

  // Skill Gap Analysis
  getSkillGapAnalysis() {
    return safeJsonParse(KEYS.SKILL_GAP, null);
  },
  saveSkillGapAnalysis(analysis) {
    safeJsonSet(KEYS.SKILL_GAP, analysis);
    return analysis;
  },

  // Missions
  getMissions() {
    return safeJsonParse(KEYS.MISSIONS, []);
  },
  saveMissions(missions) {
    safeJsonSet(KEYS.MISSIONS, missions);
    return missions;
  },
  updateMission(missionId, updates) {
    const missions = this.getMissions();
    const updated = missions.map((m) => (m.id === missionId ? { ...m, ...updates } : m));
    this.saveMissions(updated);
    return updated.find((m) => m.id === missionId);
  },

  // Assessments
  getAssessments() {
    return safeJsonParse(KEYS.ASSESSMENTS, []);
  },
  saveAssessment(assessment) {
    const assessments = this.getAssessments();
    const existingIndex = assessments.findIndex((a) => a.id === assessment.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...assessments];
      updated[existingIndex] = assessment;
    } else {
      updated = [assessment, ...assessments];
    }
    safeJsonSet(KEYS.ASSESSMENTS, updated);
    return assessment;
  },

  // Activity Feed
  getActivities() {
    return safeJsonParse(KEYS.ACTIVITIES, []);
  },
  addActivity(activity) {
    const activities = this.getActivities();
    const newEntry = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      ...activity,
    };
    const updated = [newEntry, ...activities.slice(0, 19)];
    safeJsonSet(KEYS.ACTIVITIES, updated);
    return newEntry;
  },

  // Demo Initializer
  loadDemoState() {
    this.saveUser(DEMO_USER);
    this.saveSkills(DEMO_SKILLS);
    this.saveMissions(DEMO_MISSIONS);
    this.saveAssessments(DEMO_ASSESSMENTS);
    this.saveRoadmap({
      careerGoal: DEMO_USER.careerGoal,
      weeklyHours: DEMO_USER.weeklyHours,
      duration: DEMO_USER.roadmapDuration,
      progress: DEMO_USER.stats.overallProgress,
      lastAdapted: null,
      generatedAt: '2026-09-15T10:00:00.000Z',
    });
    this.saveSkillGapAnalysis({
      targetCareer: 'MLOps Engineer',
      strong: ['Python', 'Machine Learning', 'Git/GitHub'],
      developing: ['Linux', 'Docker', 'AWS Cloud', 'MLOps Concepts'],
      majorGaps: ['CI/CD Pipelines', 'Kubernetes', 'Model Deployment', 'Monitoring & Drift'],
      readinessScore: 38,
      readinessSummary: 'Solid programming and version control foundation. Primary growth areas focus on container orchestration and automated deployment pipelines.',
    });
    safeJsonSet(KEYS.ACTIVITIES, DEMO_ACTIVITIES);
    return DEMO_USER;
  },

  // Reset Everything
  clearAll() {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
