/**
 * @author Anish
 * @description This is the landing page
 * @date 30-11-2025
 * @returns a JSX component
 */


import React from "react";
import Navbar from "@/components/common/Navbar";
import Hero from "@/components/common/Hero";
import HODSection from "@/components/common/HODSection";
import AboutSection from "@/components/common/AboutSection";
import ProjectsSection from "@/components/common/ProjectsSection";
import ResearchSection from "@/components/common/ResearchSection";
import Achievements from "@/components/common/Achievements";
import QuickLinks from "@/components/common/QuickLinks";
import Footer from "@/components/common/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6">
        <Hero />
        <HODSection />
        <AboutSection />
        <ProjectsSection />
        <ResearchSection />
        <Achievements />
        <QuickLinks />
      </main>

      <Footer />
    </div>
  );
}