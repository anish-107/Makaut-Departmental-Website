/**
 * @author Anish
 * @description This is the landing page
 * @date 30-11-2025
 * @returns a JSX component
 */

import React from 'react';
import Cover from '@/components/common/Cover';
import HODSection from '@/components/common/HODSection';
import Projects from '@/components/common/Proejcts';
import FacultySection from '@/components/common/FacultySection';
import ResearchSection from '@/components/common/ResearchSection';
import AchievementsSection from '@/components/common/AchievementsSection';

export default function LandingPage() {
  return (
    <>
      <Cover />
      <HODSection />
      <AchievementsSection />
      <FacultySection />
      <ResearchSection />
      <Projects />
    </>
  );
};
