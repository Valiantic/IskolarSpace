"use client";
import React from "react";
import { StickyScroll } from "../DashboardBlocks/ui/sticky-scroll-reveal";
import { useBackground } from "../../contexts/BackgroundContext";

const content = [
  {
    title: "Organize Seamlessly",
    description:
      "Take control of your academic workflow with structured task management. Prioritize assignments and streamline your study sessions effortlessly",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
      Organize Seamlessly
      </div>
    ),
  },
  {
   title: "Manage Team Tasks",
    description:
      "Coordinate and assign tasks within your team effortlessly. Track progress, set priorities, and ensure everyone stays aligned for successful project completion.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Manage Team Tasks
      </div>
    ),
  },
  {
    title: "Share Thoughts on Notes",
    description:
      "Collaborate by sharing insights and feedback directly on notes. Foster discussion, clarify concepts, and enhance collective understanding within students across the space!.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--sky-500),var(--emerald-200))] flex items-center justify-center text-white">
        Share Thoughts on Notes
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
