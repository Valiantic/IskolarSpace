"use client";
import React from "react";
import { StickyScroll } from "../DashboardBlocks/ui/sticky-scroll-reveal";
import { useBackground } from "../../../lib/BackgroundContext";

const content = [
  {
    title: "Organize Seamlessly",
    description:
      "Take control of your academic workflow with structured task management and smart note-taking. Prioritize assignments, track deadlines, and streamline your study sessions effortlessly",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
      Organize Seamlessly
      </div>
    ),
  },
  {
    title: "Master Your Productivity",
    description:
      "Stay on top of your daily tasks with an intuitive platform designed for efficiency. Create, organize, and refine your study plans—ensuring every goal is within reach",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--sky-500),var(--emerald-200))] flex items-center justify-center text-white">
        Master Your Productivity
      </div>
    ),
  },
  {
    title: "Explore New Horizons",
    description:
      "Our platform is more than just notes; it's a space for discovery. Uncover new ideas, gain deeper understanding, and unlock your full academic potential.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--blue-300),var(--emerald-500))] flex items-center justify-center text-white">
        Explore New Horizons
      </div>
    ),
  },
];

export function StickyScrollReveal() {
  const { setBackgroundColor } = useBackground();

  const handleColorChange = (activeCard: number) => {
    const colors = [
      "#000000", // black
      "#0f172a", // slate-900
      "#171717", // neutral-900
    ];
    setBackgroundColor(colors[activeCard % colors.length]);
  };

  return (
    <div id="features" className="p-10">
      <StickyScroll content={content} onColorChange={handleColorChange} />
    </div>
  );
}
