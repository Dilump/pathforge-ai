import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRoadmap } from '../context/RoadmapContext';
import { CAREERS } from '../data/careers';
import { RoadmapTimeline } from '../components/roadmap/RoadmapTimeline';
import { LoadingSpinner } from '../components/common/LoadingState';

export const RoadmapPage = () => {
  const { user } = useAuth();
  const { missions, roadmap, loading } = useRoadmap();

  if (loading) {
    return <LoadingSpinner text="Retrieving adaptive roadmap..." />;
  }

  const careerObj = CAREERS.find((c) => c.id === user?.careerGoal);
  const careerTitle = careerObj?.title || 'MLOps Engineer';
  const overallProgress = user?.stats?.overallProgress ?? 38;
  const weeklyHours = user?.weeklyHours ?? 8;

  return (
    <div>
      <RoadmapTimeline
        missions={missions}
        careerTitle={careerTitle}
        overallProgress={overallProgress}
        weeklyHours={weeklyHours}
      />
    </div>
  );
};
