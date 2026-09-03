import type { Metadata } from "next";
import { ProjectTopicPage } from "@/components/sections/ProjectTopicPage";

export const metadata: Metadata = {
  title: "Embedded Systems Projects",
  description:
    "Final-year embedded systems project development - microcontroller firmware, sensor interfacing and actuator control on custom hardware.",
  alternates: { canonical: "/college-projects/embedded-systems" },
};

export default function EmbeddedSystemsPage() {
  return (
    <ProjectTopicPage
      eyebrow="Embedded Systems"
      title="Embedded Systems Projects"
      lead="Firmware and hardware built together - sensor conditioning, control logic and actuator drive on a board you can point at and explain."
      ideas={[
        {
          title: "Automatic Water Level Controller",
          body: "Ultrasonic level sensing driving a pump, with dry-run protection and overflow cut-off.",
          stack: ["ATmega", "HC-SR04", "Embedded C"],
        },
        {
          title: "Digital Weighing System",
          body: "Load cell with amplification, a calibration routine and a stable filtered display reading.",
          stack: ["HX711", "STM32", "LCD"],
        },
        {
          title: "Motor Speed Controller",
          body: "Closed-loop PWM speed control with encoder feedback and a tunable PID implementation.",
          stack: ["PIC", "PWM", "Encoder"],
        },
        {
          title: "Gas Leak Detection Unit",
          body: "Continuous gas sensing with a calibrated threshold, local siren and automatic supply cut-off.",
          stack: ["MQ-2", "ATmega", "Relay"],
        },
        {
          title: "RFID Access Controller",
          body: "Tag reading, an EEPROM-stored authorised list and a solenoid lock driver with entry logging.",
          stack: ["RC522", "EEPROM", "Embedded C"],
        },
        {
          title: "Data Logger with RTC",
          body: "Periodic sensor sampling written to SD card with real-time timestamps and power-loss safety.",
          stack: ["DS3231", "SD card", "SPI"],
        },
      ]}
      deliverables={[
        "Schematic capture and, where required, a PCB layout",
        "Assembled and bench-tested hardware, not a breadboard held together by hope",
        "Firmware in Embedded C with a documented module structure",
        "Sensor calibration procedure, with the measured error stated",
        "Test results across the operating range, recorded rather than claimed",
        "Power supply design with correct regulation and decoupling",
        "Project report with schematics, flowcharts and result tables",
        "Code walkthrough, so you can answer questions on any function",
      ]}
      technologies={[
        "Embedded C",
        "ARM Cortex-M",
        "ATmega",
        "STM32",
        "PIC",
        "SPI / I2C",
        "UART",
        "KiCad",
      ]}
      whatsappMessage="Hello Autonex Solutions, I need help with an Embedded Systems final year project."
    />
  );
}
