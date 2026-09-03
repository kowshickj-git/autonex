import type { Metadata } from "next";
import { ProjectTopicPage } from "@/components/sections/ProjectTopicPage";

export const metadata: Metadata = {
  title: "ESP32 & IoT Projects",
  description:
    "Final-year ESP32 and IoT project development - connected sensor nodes reporting to a cloud dashboard and a mobile app.",
  alternates: { canonical: "/college-projects/esp32-iot" },
};

export default function Esp32IotPage() {
  return (
    <ProjectTopicPage
      eyebrow="ESP32 & IoT"
      title="ESP32 & IoT Projects"
      lead="Sensor nodes that genuinely publish to the cloud and control real hardware - built on ESP32, with an app you can open in front of the examiner."
      ideas={[
        {
          title: "Smart Agriculture Monitor",
          body: "Soil moisture, temperature and humidity reported to a dashboard, with automatic irrigation control.",
          stack: ["ESP32", "MQTT", "Firebase"],
        },
        {
          title: "Air Quality Monitoring",
          body: "Measures particulate matter and gas concentration, logs trends and raises alerts above a threshold.",
          stack: ["ESP32", "MQ sensors", "ThingSpeak"],
        },
        {
          title: "Smart Energy Meter",
          body: "Measures consumption per circuit and shows live and historical usage in a mobile dashboard.",
          stack: ["ESP32", "ACS712", "Blynk"],
        },
        {
          title: "Home Automation Node",
          body: "App and voice controlled relays, with local fallback so the switches keep working without the internet.",
          stack: ["ESP32", "MQTT", "Flutter"],
        },
        {
          title: "Health Monitoring Band",
          body: "Heart rate and temperature sensing with cloud logging and threshold alerts to a nominated contact.",
          stack: ["ESP32", "MAX30102", "Firebase"],
        },
        {
          title: "Industrial Asset Tracker",
          body: "Location and vibration monitoring for equipment, reporting anomalies to a maintenance dashboard.",
          stack: ["ESP32", "MPU6050", "Node-RED"],
        },
      ]}
      deliverables={[
        "Circuit diagram and a working, tested hardware assembly",
        "Firmware source in Arduino or ESP-IDF, commented throughout",
        "Reliable Wi-Fi reconnection and error handling, tested by pulling the network",
        "Cloud dashboard showing live values and historical trends",
        "Mobile app or responsive web interface for monitoring and control",
        "Calibration procedure and measured accuracy for each sensor",
        "Project report with block diagrams, flowcharts and results",
        "Handover session covering the firmware structure and how to extend it",
      ]}
      technologies={[
        "ESP32",
        "Arduino",
        "MQTT",
        "Firebase",
        "Node-RED",
        "Blynk",
        "Flutter",
        "C++",
      ]}
      whatsappMessage="Hello Autonex Solutions, I need help with an ESP32 / IoT final year project."
    />
  );
}
