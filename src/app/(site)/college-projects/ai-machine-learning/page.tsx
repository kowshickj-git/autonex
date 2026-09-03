import type { Metadata } from "next";
import { ProjectTopicPage } from "@/components/sections/ProjectTopicPage";

export const metadata: Metadata = {
  title: "AI & Machine Learning Projects",
  description:
    "Final-year AI and machine learning project development - dataset preparation, model training, evaluation and a working prediction interface.",
  alternates: { canonical: "/college-projects/ai-machine-learning" },
};

export default function AiMlPage() {
  return (
    <ProjectTopicPage
      eyebrow="AI & Machine Learning"
      title="AI & Machine Learning Projects"
      lead="Models that solve a stated problem, trained on a real dataset, evaluated honestly and wrapped in an interface you can demonstrate."
      ideas={[
        {
          title: "Crop Yield Prediction",
          body: "Regression model using soil, rainfall and temperature data to forecast yield for a region.",
          stack: ["Python", "scikit-learn", "Pandas"],
        },
        {
          title: "Disease Risk Classification",
          body: "Classification on clinical parameters, with feature importance explained rather than treated as a black box.",
          stack: ["Python", "XGBoost", "Streamlit"],
        },
        {
          title: "Student Performance Predictor",
          body: "Predicts outcomes from attendance and assessment history, with a dashboard for the department.",
          stack: ["Python", "Flask", "SQLite"],
        },
        {
          title: "Sentiment Analysis System",
          body: "Text classification over reviews or social posts, with preprocessing and vectorisation explained end to end.",
          stack: ["NLTK", "TF-IDF", "Transformers"],
        },
        {
          title: "Recommendation Engine",
          body: "Collaborative or content-based filtering with a working front end and a documented similarity measure.",
          stack: ["Python", "NumPy", "React"],
        },
        {
          title: "Anomaly Detection",
          body: "Identifies unusual patterns in sensor or transaction data, useful for fraud or equipment fault detection.",
          stack: ["Isolation Forest", "Pandas", "Plotly"],
        },
      ]}
      deliverables={[
        "Problem statement and literature review written to your department's format",
        "Cleaned dataset with the preprocessing steps documented and reproducible",
        "Trained model with the training script, not just the saved weights",
        "Evaluation report - accuracy, precision, recall, F1 and confusion matrix",
        "Working demonstration interface for live prediction on new input",
        "Complete source code, commented so you can explain any line of it",
        "Project report, block diagrams and a presentation deck",
        "Walkthrough sessions until you can defend the design decisions yourself",
      ]}
      technologies={[
        "Python",
        "TensorFlow",
        "PyTorch",
        "scikit-learn",
        "Pandas",
        "NumPy",
        "Flask",
        "Streamlit",
      ]}
      whatsappMessage="Hello Autonex Solutions, I need help with an AI / Machine Learning final year project."
    />
  );
}
