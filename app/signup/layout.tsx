import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your IskolarSpace account to plan coursework, track deadlines, generate AI study plans, and collaborate with classmates in shared spaces.",
  alternates: { canonical: "/signup" },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
