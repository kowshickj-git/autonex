/**
 * Engineering lab equipment catalogue.
 *
 * Prices are deliberately absent: every card carries a "Request Quote" action
 * instead, because institutional pricing depends on quantity, configuration
 * and installation scope. Add a `price` field here only if the owner decides
 * to publish fixed prices.
 */

export type EquipmentCategory = {
  slug: string;
  name: string;
  blurb: string;
};

export const equipmentCategories: EquipmentCategory[] = [
  { slug: "electrical", name: "Electrical Engineering Lab Equipment", blurb: "Machines, measurement and power distribution trainers." },
  { slug: "electronics", name: "Electronics Lab Equipment", blurb: "Analog circuits, amplifiers and instrumentation benches." },
  { slug: "embedded", name: "Embedded Systems Lab Equipment", blurb: "Development boards, debuggers and peripheral interface kits." },
  { slug: "microcontroller", name: "Microcontroller Training Kits", blurb: "8051, PIC, AVR and ARM trainer boards with lab manuals." },
  { slug: "digital", name: "Digital Electronics Kits", blurb: "Logic gates, flip-flops, counters and combinational design." },
  { slug: "communication", name: "Communication Systems Kits", blurb: "AM/FM modulation, digital communication and antenna trainers." },
  { slug: "control", name: "Control Systems Equipment", blurb: "PID controllers, servo trainers and process control loops." },
  { slug: "power-electronics", name: "Power Electronics Equipment", blurb: "Converters, inverters, choppers and drive trainers." },
  { slug: "iot", name: "IoT Training Kits", blurb: "Wi-Fi and BLE nodes with cloud dashboards for lab exercises." },
  { slug: "automation", name: "Automation Training Kits", blurb: "PLC, SCADA, pneumatics and industrial sensor trainers." },
  { slug: "robotics", name: "Robotics Training Kits", blurb: "Mobile robot platforms, robotic arms and gripper assemblies." },
  { slug: "sensors", name: "Sensor Training Kits", blurb: "Temperature, pressure, level, proximity and optical sensing." },
];

export type EquipmentProduct = {
  name: string;
  category: string;
  description: string;
  applications: string[];
  specifications: { label: string; value: string }[];
};

export const equipmentProducts: EquipmentProduct[] = [
  {
    name: "Microcontroller Trainer Kit",
    category: "Microcontroller Training Kits",
    description:
      "A self-contained trainer board covering GPIO, timers, interrupts, ADC and serial communication, with on-board peripherals so students can complete an entire syllabus without external wiring.",
    applications: ["Embedded C laboratory", "Microprocessor & microcontroller courses", "Mini-project development"],
    specifications: [
      { label: "Controller", value: "8051 / PIC / AVR / ARM" },
      { label: "Programmer", value: "On-board USB" },
      { label: "Peripherals", value: "LCD, keypad, LEDs, relays, ADC" },
      { label: "Supply", value: "230 V AC / 5 V DC regulated" },
    ],
  },
  {
    name: "Digital Electronics Trainer",
    category: "Digital Electronics Kits",
    description:
      "Breadboard-based digital trainer with fixed supplies, clock generation, logic level indicators and switch banks for building combinational and sequential circuits.",
    applications: ["Logic design laboratory", "Flip-flop and counter experiments", "Combinational circuit design"],
    specifications: [
      { label: "Logic supply", value: "+5 V DC regulated" },
      { label: "Clock", value: "1 Hz - 1 MHz, selectable" },
      { label: "Indicators", value: "16 LED logic monitors" },
      { label: "Inputs", value: "16 toggle + 4 pulse switches" },
    ],
  },
  {
    name: "PLC & Automation Trainer",
    category: "Automation Training Kits",
    description:
      "Industrial-grade PLC mounted with simulated field inputs and outputs, so ladder logic written in the lab behaves exactly as it would on a real plant floor.",
    applications: ["Industrial automation lab", "Ladder logic programming", "SCADA integration practice"],
    specifications: [
      { label: "PLC", value: "Industrial brand, 16 I/O" },
      { label: "Inputs", value: "Toggle, proximity, limit switch" },
      { label: "Outputs", value: "Relay, indicator lamps, motor" },
      { label: "Software", value: "Ladder programming suite" },
    ],
  },
  {
    name: "Control Systems Trainer",
    category: "Control Systems Equipment",
    description:
      "Closed-loop position and speed control trainer with adjustable PID parameters and a live response plot, letting students see the effect of each gain immediately.",
    applications: ["Control systems laboratory", "PID tuning experiments", "Transient response analysis"],
    specifications: [
      { label: "Plant", value: "DC servo motor with encoder" },
      { label: "Controller", value: "Analog + digital PID" },
      { label: "Measurement", value: "Speed, position, error signal" },
      { label: "Output", value: "PC interface for plotting" },
    ],
  },
  {
    name: "Communication Systems Trainer",
    category: "Communication Systems Kits",
    description:
      "Modulation and demodulation trainer covering AM, FM, PAM, PWM, PPM and digital schemes, with test points at every stage of the signal chain.",
    applications: ["Analog communication lab", "Digital communication lab", "Signal analysis practicals"],
    specifications: [
      { label: "Schemes", value: "AM, FM, PAM, PWM, PPM, ASK, FSK, PSK" },
      { label: "Test points", value: "Stage-wise, oscilloscope ready" },
      { label: "Carrier", value: "Built-in generator" },
      { label: "Supply", value: "230 V AC, 50 Hz" },
    ],
  },
  {
    name: "IoT & Sensor Training Kit",
    category: "IoT Training Kits",
    description:
      "ESP32-based node with a sensor suite and a cloud dashboard, taking students from a single analog reading through to a remotely monitored, app-controlled system.",
    applications: ["IoT laboratory", "Sensor interfacing", "Final-year project base platform"],
    specifications: [
      { label: "Controller", value: "ESP32 (Wi-Fi + BLE)" },
      { label: "Sensors", value: "Temperature, humidity, PIR, LDR, gas" },
      { label: "Actuators", value: "Relay, buzzer, servo" },
      { label: "Cloud", value: "MQTT / HTTP dashboard" },
    ],
  },
];
