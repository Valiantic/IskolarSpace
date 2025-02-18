"use client";
import React from "react";
import { StickyScroll } from "../components/ui/sticky-scroll-reveal";
import { useBackground } from "../../lib/BackgroundContext";

const content = [
  {
    title: "Efficient Task Management",
    description:
      "IskolarSpace streamlines your academic life by consolidating all your tasks, assignments, and deadlines into one intuitive dashboard. With smart reminders and prioritization tools, you can effortlessly stay organized and ahead of your workload..",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Efficient Task Management
      </div>
    ),
  },
  {
    title: "Seamless Collaboration",
    description:
      "Connect with classmates like never before through IskolarSpace's integrated communication features. Engage in real-time discussions, share resources, and collaborate on projects within a unified platform designed to enhance teamwork.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Seamless Collaboration
      </div>
    ),
  },
  {
    title: "Personal Development Tools",
    description:
      "Beyond academics, IskolarSpace supports your growth with tools for goal setting and progress tracking. Access a wealth of resources to develop essential skills, while insightful analytics help you monitor your achievements.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
        Personal Development Tools
      </div>
    ),
  },
  {
    title: "User-Friendly Interface",
    description:
      "Navigate your studies with ease using IskolarSpace's clean, intuitive design crafted specifically for students. Personalize your workspace with customizable themes, and enjoy full functionality across all devices for productivity on the go.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        User-Friendly Interface
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
    <div className="p-10">
      <StickyScroll content={content} onColorChange={handleColorChange} />
    </div>
  );
}
