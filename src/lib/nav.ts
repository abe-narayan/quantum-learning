export type NavItem = {
  label: string;
  href: string;
  description: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "/",
    description: "Start here — an overview of the QuantumLearn platform.",
  },
  {
    label: "Learn",
    href: "/learn",
    description: "The recommended learning path, from qubits to algorithms.",
  },
  {
    label: "Lessons",
    href: "/lessons",
    description: "The full lesson library, organized by topic and difficulty.",
  },
  {
    label: "Simulators",
    href: "/simulators",
    description: "Interactive tools for building intuition about quantum states.",
  },
  {
    label: "Problems",
    href: "/problems",
    description: "Practice problems and quizzes to check your understanding.",
  },
  {
    label: "About",
    href: "/about",
    description: "Who QuantumLearn is for, and what we're building.",
  },
];
