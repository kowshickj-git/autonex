import type { Metadata } from "next";
import { ProjectTopicPage } from "@/components/sections/ProjectTopicPage";

export const metadata: Metadata = {
  title: "Computer Vision Projects",
  description:
    "Final-year computer vision project development - detection, recognition and tracking systems built on real camera input with a working dashboard.",
  alternates: { canonical: "/college-projects/computer-vision" },
};

export default function ComputerVisionPage() {
  return (
    <ProjectTopicPage
      eyebrow="Computer Vision"
      title="Computer Vision Projects"
      lead="Detection, recognition and tracking systems that run on a real camera feed - not on a curated set of test images."
      ideas={[
        {
          title: "Face Recognition Attendance",
          body: "Marks attendance from a live camera feed, with enrolment, recognition and a register the department can export.",
          stack: ["OpenCV", "dlib", "SQLite"],
        },
        {
          title: "Helmet & Safety Detection",
          body: "Detects whether personnel are wearing required safety gear and logs violations with a timestamped frame.",
          stack: ["YOLO", "OpenCV", "Flask"],
        },
        {
          title: "Vehicle Number Plate Reader",
          body: "Detects plates, reads the characters and matches them against an authorised list for gate access.",
          stack: ["OpenCV", "EasyOCR", "MySQL"],
        },
        {
          title: "Object Counting System",
          body: "Counts items crossing a line on a conveyor or entrance, with tracking so nothing is counted twice.",
          stack: ["YOLO", "SORT", "Python"],
        },
        {
          title: "Drowsiness Detection",
          body: "Monitors eye aspect ratio and head pose to detect fatigue, with an audible alert on sustained closure.",
          stack: ["MediaPipe", "OpenCV", "NumPy"],
        },
        {
          title: "Gesture Controlled Interface",
          body: "Recognises hand gestures from a webcam and maps them to system or hardware commands.",
          stack: ["MediaPipe", "OpenCV", "PySerial"],
        },
      ]}
      deliverables={[
        "Problem statement, literature review and system architecture diagram",
        "Annotated dataset, or a documented and reproducible annotation process",
        "Trained detection model with the training configuration included",
        "Live camera pipeline that runs at a measured, stated frame rate",
        "Detection logging to a database, with a dashboard to review results",
        "Accuracy evaluation on a held-out test set - not on the training images",
        "Complete commented source code and a project report",
        "Demonstration rehearsal, so the live demo does not surprise you",
      ]}
      technologies={[
        "OpenCV",
        "YOLO",
        "MediaPipe",
        "TensorFlow",
        "PyTorch",
        "Flask",
        "SQLite",
        "NumPy",
      ]}
      whatsappMessage="Hello Autonex Solutions, I need help with a Computer Vision final year project."
    />
  );
}
