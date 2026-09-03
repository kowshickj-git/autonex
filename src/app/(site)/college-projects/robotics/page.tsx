import type { Metadata } from "next";
import { ProjectTopicPage } from "@/components/sections/ProjectTopicPage";

export const metadata: Metadata = {
  title: "Robotics Projects",
  description:
    "Final-year robotics project development - mobile robots, robotic arms and automated pick-and-place systems with real motion control.",
  alternates: { canonical: "/college-projects/robotics" },
};

export default function RoboticsPage() {
  return (
    <ProjectTopicPage
      eyebrow="Robotics"
      title="Robotics Projects"
      lead="Mobile platforms and robotic arms with genuine motion control - kinematics worked out on paper before a single servo is wired."
      ideas={[
        {
          title: "Pick and Place Robotic Arm",
          body: "Multi-servo arm with inverse kinematics, a gripper and a repeatable transfer sequence.",
          stack: ["Arduino", "Servos", "Kinematics"],
        },
        {
          title: "Line Following Robot",
          body: "IR array sensing with PID steering correction, tuned for speed without losing the line at corners.",
          stack: ["ATmega", "IR array", "PID"],
        },
        {
          title: "Obstacle Avoiding Rover",
          body: "Ultrasonic scanning with a path-decision routine and differential drive control.",
          stack: ["HC-SR04", "L298N", "Arduino"],
        },
        {
          title: "Voice Controlled Robot",
          body: "Speech commands from a phone translated into movement, with a safety stop that always wins.",
          stack: ["Bluetooth", "Android", "Arduino"],
        },
        {
          title: "Agricultural Seeding Robot",
          body: "Autonomous row navigation with a metered seed dispenser and coverage logging.",
          stack: ["ESP32", "GPS", "Stepper"],
        },
        {
          title: "Warehouse AGV",
          body: "Guided vehicle following a marked path, with load detection and station stopping.",
          stack: ["ROS", "Encoders", "Python"],
        },
      ]}
      deliverables={[
        "Mechanical design with the degrees of freedom and reach stated",
        "Motor and servo selection justified against the actual torque required",
        "Assembled chassis or arm, tested through its full range of motion",
        "Control firmware with the movement sequence documented",
        "Kinematics or control calculations worked through in the report",
        "Repeatability testing - the same command producing the same result",
        "Project report with mechanical drawings, circuits and results",
        "Demonstration rehearsal, including what to do if a servo misbehaves",
      ]}
      technologies={[
        "Arduino",
        "ROS",
        "Servo control",
        "Stepper drivers",
        "Python",
        "Embedded C",
        "Kinematics",
        "PID",
      ]}
      whatsappMessage="Hello Autonex Solutions, I need help with a Robotics final year project."
    />
  );
}
