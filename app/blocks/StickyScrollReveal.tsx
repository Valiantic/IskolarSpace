"use client";
import React from "react";
import { StickyScroll } from "../components/ui/sticky-scroll-reveal";
import { useBackground } from "../../lib/BackgroundContext";

const content = [
  {
    title: "Connect Globally",
    description:
      "Join a vibrant community of learners from diverse backgrounds and cultures. Expand your network, share perspectives, and make lifelong connections.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
      Connect Globally
      </div>
    ),
  },
  {
    title: "Collaborate Effortlessly",
    description:
      "Experience the future of group study with intuitive, real-time collaborative note-taking. Work together on projects, assignments, and exam prep like never before.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--sky-500),var(--emerald-200))] flex items-center justify-center text-white">
        Collaborate Effortlessly
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
    <div className="p-10">
      <StickyScroll content={content} onColorChange={handleColorChange} />
    </div>
  );
}
