import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to IskolarSpace to manage your academic tasks on a Kanban board, build AI study plans, and work with classmates in shared spaces.",
  alternates: { canonical: "/login" },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
