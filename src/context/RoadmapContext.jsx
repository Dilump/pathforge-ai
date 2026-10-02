import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { roadmapService } from '../services/roadmapService';
import { quizService } from '../services/quizService';
import { useAuth } from './AuthContext';

const RoadmapContext = createContext(null);

export const RoadmapProvider = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [roadmap, setRoadmap] = useState(null);
  const [missions, setMissions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skillGap, setSkillGap] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [adaptationAlert, setAdaptationAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAllData = useCallback(() => {
    try {
      const r = storageService.getRoadmap();
      const m = storageService.getMissions();
      const s = storageService.getSkills();
      const sg = storageService.getSkillGapAnalysis();
      const a = storageService.getAssessments();
      const act = storageService.getActivities();

      setRoadmap(r);
      setMissions(m || []);
      setSkills(s || []);
      setSkillGap(sg);
      setAssessments(a || []);
      setActivities(act || []);
    } catch (err) {
      console.error('Error loading roadmap state:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadAllData();
    } else {
      setRoadmap(null);
      setMissions([]);
      setSkills([]);
      setSkillGap(null);
      setAssessments([]);
      setActivities([]);
      setLoading(false);
    }
  }, [user, loadAllData]);

  // Find currently active mission
  const activeMission = missions.find((m) => m.status === 'current') || missions[0] || null;

  const toggleTask = async (missionId, taskId) => {
    const updated = await roadmapService.toggleTask(missionId, taskId);
    setMissions((prev) => prev.map((m) => (m.id === missionId ? updated : m)));
    loadAllData();
    return updated;
  };

  const toggleChallenge = async (missionId) => {
    const updated = await roadmapService.toggleChallenge(missionId);
    if (updated) {
      setMissions((prev) => prev.map((m) => (m.id === missionId ? updated : m)));
      loadAllData();
    }
    return updated;
  };

  const handleAssessmentCompleted = async (mission, questions, userAnswers) => {
    const result = await quizService.submitAssessment(mission, questions, userAnswers);
    loadAllData();

    if (result.adaptation && result.adaptation.isAdapted) {
      setAdaptationAlert(result.adaptation);
    }

    return result;
  };

  const clearAdaptationAlert = () => {
    setAdaptationAlert(null);
  };

  const refreshState = () => {
    loadAllData();
  };

  return (
    <RoadmapContext.Provider
      value={{
        roadmap,
        missions,
        skills,
        skillGap,
        assessments,
        activities,
        activeMission,
        adaptationAlert,
        loading,
        toggleTask,
        toggleChallenge,
        handleAssessmentCompleted,
        clearAdaptationAlert,
        refreshState,
      }}
    >
      {children}
    </RoadmapContext.Provider>
  );
};

export const useRoadmap = () => {
  const context = useContext(RoadmapContext);
  if (!context) {
    throw new Error('useRoadmap must be used within a RoadmapProvider');
  }
  return context;
};
