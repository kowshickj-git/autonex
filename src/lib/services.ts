import {
  BellRing,
  Bot,
  Brain,
  Cctv,
  CircuitBoard,
  Code2,
  Cpu,
  Database,
  DoorOpen,
  Droplets,
  Eye,
  GraduationCap,
  Lightbulb,
  Lock,
  Car,
  Smartphone,
  Waves,
  Wifi,
  type LucideIcon,
} from "lucide-react";

/**
 * The nine headline solutions shown on the home page, and the project
 * categories used by the College Projects section.
 */

export type Solution = {
  slug: string;
  href: string;
  title: string;
  short: string;
  description: string;
  icon: LucideIcon;
  /** Drives the per-icon hover gesture (see components/ui/ServiceIcon.tsx). */
  motion: "rotate" | "slide" | "lift" | "drop" | "wave" | "pulse" | "lens" | "glow" | "scale";
  group: "automation" | "engineering" | "water" | "security" | "projects";
  highlights: string[];
};

export const solutions: Solution[] = [
  {
    slug: "engineering-lab-equipment",
    href: "/engineering-lab-equipment",
    title: "Engineering Lab Equipment",
    short: "Training kits, trainer boards and complete laboratory setups for technical institutions.",
    description:
      "Practical engineering equipment for electrical, electronics, embedded, communication, control and power laboratories - supplied, installed and commissioned.",
    icon: CircuitBoard,
    motion: "rotate",
    group: "engineering",
    highlights: ["Trainer kits", "Lab setup & commissioning", "Institution supply"],
  },
  {
    slug: "gate-automation",
    href: "/gate-automation",
    title: "Gate Automation",
    short: "Automatic swing and sliding gate systems with remote, RFID and safety sensors.",
    description:
      "Motorised gate systems for homes, apartments, factories and commercial properties - with obstacle detection, manual override and battery backup.",
    icon: DoorOpen,
    motion: "slide",
    group: "automation",
    highlights: ["Swing & sliding", "Remote / RFID", "Safety sensors"],
  },
  {
    slug: "home-lighting-automation",
    href: "/home-lighting-automation",
    title: "Home Lighting Automation",
    short: "Smart switches, scenes, scheduling and mobile control for a more efficient home.",
    description:
      "Convert existing wiring into an app-controlled, sensor-aware lighting system with scenes, schedules and voice assistant support.",
    icon: Lightbulb,
    motion: "glow",
    group: "automation",
    highlights: ["Mobile & voice control", "Motion sensing", "Energy saving"],
  },
  {
    slug: "boom-barrier",
    href: "/boom-barrier",
    title: "Boom Barrier",
    short: "Automatic vehicle entry and exit control for campuses, parking and industry.",
    description:
      "Fast, high-duty-cycle barrier systems integrated with RFID, access cards, loop detectors and remote control.",
    icon: Car,
    motion: "lift",
    group: "automation",
    highlights: ["RFID & access cards", "Loop detection", "High duty cycle"],
  },
  {
    slug: "water-purifier-ro-plant",
    href: "/water-purifier-ro-plant",
    title: "Water Purifier & RO Plant",
    short: "Domestic purifiers through to commercial and industrial reverse-osmosis plants.",
    description:
      "Multi-stage purification - sediment, carbon, RO membrane and UV - sized to your source water report and daily demand.",
    icon: Droplets,
    motion: "drop",
    group: "water",
    highlights: ["Domestic to industrial", "Multi-stage filtration", "AMC available"],
  },
  {
    slug: "water-softener",
    href: "/water-softener",
    title: "Water Softener",
    short: "Ion-exchange softening that protects plumbing, geysers and appliances.",
    description:
      "Resin-based softeners that remove calcium and magnesium hardness, with manual or automatic regeneration valves.",
    icon: Waves,
    motion: "wave",
    group: "water",
    highlights: ["Ion exchange", "Auto regeneration", "Scale protection"],
  },
  {
    slug: "security-alarm",
    href: "/security-alarm",
    title: "Security Alarm",
    short: "Intrusion detection with zoned sensors, control panel and instant alerting.",
    description:
      "Door, window, motion and glass-break sensors wired to a control panel with siren, mobile notification and optional monitoring.",
    icon: BellRing,
    motion: "pulse",
    group: "security",
    highlights: ["Zoned detection", "Mobile alerts", "Siren & strobe"],
  },
  {
    slug: "cctv",
    href: "/cctv",
    title: "CCTV Surveillance",
    short: "HD and IP camera systems with recording, remote viewing and analytics.",
    description:
      "Site survey, camera placement, NVR/DVR configuration and mobile access - designed around actual coverage, not camera count.",
    icon: Cctv,
    motion: "lens",
    group: "security",
    highlights: ["IP & HD cameras", "Remote viewing", "Night vision"],
  },
  {
    slug: "college-projects",
    href: "/college-projects",
    title: "College Final Year Projects",
    short: "End-to-end guidance and development for engineering final-year projects.",
    description:
      "AI/ML, computer vision, IoT, embedded, robotics and software projects - built, documented and explained so you can defend them.",
    icon: GraduationCap,
    motion: "scale",
    group: "projects",
    highlights: ["Full documentation", "Live demo support", "Concept to viva"],
  },
];

export const solutionBySlug = (slug: string) => solutions.find((s) => s.slug === slug);

/* ------------------------------------------------------------------ *
 * College project categories (spec section 21)
 * ------------------------------------------------------------------ */

export type ProjectCategory = {
  title: string;
  blurb: string;
  icon: LucideIcon;
  href?: string;
  tags: string[];
};

export const projectCategories: ProjectCategory[] = [
  {
    title: "AI & Machine Learning",
    blurb: "Prediction, classification and recommendation models with a documented training pipeline.",
    icon: Brain,
    href: "/college-projects/ai-machine-learning",
    tags: ["Python", "TensorFlow", "scikit-learn"],
  },
  {
    title: "Computer Vision",
    blurb: "Detection, recognition and tracking systems built on real camera input.",
    icon: Eye,
    href: "/college-projects/computer-vision",
    tags: ["OpenCV", "YOLO", "MediaPipe"],
  },
  {
    title: "ESP32 & IoT",
    blurb: "Connected sensor nodes reporting to a cloud dashboard and a mobile app.",
    icon: Wifi,
    href: "/college-projects/esp32-iot",
    tags: ["ESP32", "MQTT", "Firebase"],
  },
  {
    title: "Embedded Systems",
    blurb: "Microcontroller firmware, sensor interfacing and actuator control on custom hardware.",
    icon: Cpu,
    href: "/college-projects/embedded-systems",
    tags: ["ARM", "Arduino", "Embedded C"],
  },
  {
    title: "Robotics",
    blurb: "Mobile robots, robotic arms and automated pick-and-place systems.",
    icon: Bot,
    href: "/college-projects/robotics",
    tags: ["ROS", "Kinematics", "Motor control"],
  },
  {
    title: "Software Development",
    blurb: "Full-stack applications with authentication, database and admin tooling.",
    icon: Code2,
    tags: ["React", "Node.js", "PostgreSQL"],
  },
  {
    title: "Web Development",
    blurb: "Responsive, production-grade web platforms and dashboards.",
    icon: Code2,
    tags: ["Next.js", "REST API", "Tailwind"],
  },
  {
    title: "Mobile Development",
    blurb: "Android and cross-platform apps that talk to real hardware or cloud services.",
    icon: Smartphone,
    tags: ["Flutter", "React Native", "Kotlin"],
  },
  {
    title: "Data Science",
    blurb: "Data cleaning, analysis, visualisation and reporting on real datasets.",
    icon: Database,
    tags: ["Pandas", "NumPy", "Power BI"],
  },
  {
    title: "AI Models",
    blurb: "Fine-tuning, evaluation and deployment of models behind a working interface.",
    icon: Brain,
    tags: ["PyTorch", "Transformers", "ONNX"],
  },
  {
    title: "Cyber Security",
    blurb: "Secure system design, vulnerability analysis and defensive tooling.",
    icon: Lock,
    tags: ["Network security", "Cryptography", "Auditing"],
  },
];

/* ------------------------------------------------------------------ *
 * Gallery categories (spec section 10) - shared by the public filter bar
 * and the admin upload form so the two can never drift apart.
 * ------------------------------------------------------------------ */

export const GALLERY_CATEGORIES = [
  "Automation",
  "Gate Automation",
  "Home Automation",
  "Boom Barrier",
  "RO Plant",
  "Water Solutions",
  "Water Softener",
  "CCTV",
  "Security",
  "Engineering Lab Equipment",
  "College Projects",
  "AI / ML",
  "ESP32 / IoT",
  "Embedded Systems",
  "Computer Vision",
  "Robotics",
  "Other",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export const isGalleryCategory = (v: unknown): v is GalleryCategory =>
  typeof v === "string" && (GALLERY_CATEGORIES as readonly string[]).includes(v);
