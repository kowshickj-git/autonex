/**
 * Single source of truth for company details, navigation and contact points.
 * Everything a non-developer might need to edit lives here.
 */

export const company = {
  name: "Autonex Solutions",
  shortName: "Autonex",
  tagline: "Automation | Engineering | Innovation",
  taglineParts: ["Automation", "Engineering", "Innovation"],
  owner: "Rajesh Kumar . A",
  ownerRole: "Founder & Principal Engineer",
  email: "autonexsolutionss@gmail.com",
  phones: ["9003242334", "9498023341"],
  /** E.164 for tel: / wa.me links (India +91). */
  phonesIntl: ["+919003242334", "+919498023341"],
  whatsapp: "919003242334",
  address: {
    line1: "No.8 Plot No.12, 3rd Cross Street",
    line2: "Thirumurugan Nagar, Porur",
    city: "Chennai",
    pincode: "600116",
    state: "Tamil Nadu",
    country: "India",
  },
  hours: [
    { days: "Monday - Saturday", time: "9:00 AM - 7:00 PM" },
    { days: "Sunday", time: "By appointment" },
  ],
} as const;

export const addressLines = [
  company.address.line1 + ",",
  company.address.line2 + ",",
  `${company.address.city} - ${company.address.pincode}`,
];

export const addressOneLine = `${company.address.line1}, ${company.address.line2}, ${company.address.city} - ${company.address.pincode}`;

export const whatsappLink = (message = "Hello Autonex Solutions, I would like to know more about your services.") =>
  `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://autonexsolutions.com";

/* ------------------------------------------------------------------ *
 * Navigation
 * ------------------------------------------------------------------ */

export type NavChild = { label: string; href: string; blurb?: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Automation",
    href: "/automation",
    children: [
      { label: "Gate Automation", href: "/gate-automation", blurb: "Swing & sliding gate systems" },
      { label: "Home Lighting Automation", href: "/home-lighting-automation", blurb: "Smart switches, scenes & scheduling" },
      { label: "Boom Barrier", href: "/boom-barrier", blurb: "Vehicle entry & exit control" },
    ],
  },
  {
    label: "Engineering",
    href: "/engineering-lab-equipment",
    children: [
      { label: "Engineering Lab Equipment", href: "/engineering-lab-equipment", blurb: "Training kits & lab setups" },
    ],
  },
  {
    label: "Water",
    href: "/water-solutions",
    children: [
      { label: "Water Purifier & RO Plant", href: "/water-purifier-ro-plant", blurb: "Domestic, commercial & industrial RO" },
      { label: "Water Softener", href: "/water-softener", blurb: "Hardness removal & ion exchange" },
    ],
  },
  {
    label: "Security",
    href: "/security-solutions",
    children: [
      { label: "CCTV Surveillance", href: "/cctv", blurb: "IP & HD camera systems" },
      { label: "Security Alarm", href: "/security-alarm", blurb: "Intrusion detection & alerting" },
    ],
  },
  {
    label: "Projects",
    href: "/college-projects",
    children: [
      { label: "AI & Machine Learning", href: "/college-projects/ai-machine-learning" },
      { label: "Computer Vision", href: "/college-projects/computer-vision" },
      { label: "ESP32 & IoT", href: "/college-projects/esp32-iot" },
      { label: "Embedded Systems", href: "/college-projects/embedded-systems" },
      { label: "Robotics", href: "/college-projects/robotics" },
    ],
  },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

/** Flat list used by the footer and the mobile menu. */
export const footerNav = {
  solutions: [
    { label: "Gate Automation", href: "/gate-automation" },
    { label: "Home Lighting Automation", href: "/home-lighting-automation" },
    { label: "Boom Barrier", href: "/boom-barrier" },
    { label: "Water Purifier & RO Plant", href: "/water-purifier-ro-plant" },
    { label: "Water Softener", href: "/water-softener" },
    { label: "Security Alarm", href: "/security-alarm" },
    { label: "CCTV Surveillance", href: "/cctv" },
  ],
  engineering: [
    { label: "Engineering Lab Equipment", href: "/engineering-lab-equipment" },
    { label: "College Final Year Projects", href: "/college-projects" },
    { label: "AI & Machine Learning", href: "/college-projects/ai-machine-learning" },
    { label: "Computer Vision", href: "/college-projects/computer-vision" },
    { label: "ESP32 & IoT", href: "/college-projects/esp32-iot" },
    { label: "Embedded Systems", href: "/college-projects/embedded-systems" },
    { label: "Robotics", href: "/college-projects/robotics" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Automation Overview", href: "/automation" },
    { label: "Water Solutions", href: "/water-solutions" },
    { label: "Security Solutions", href: "/security-solutions" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ],
};

/* ------------------------------------------------------------------ *
 * Trust indicators shown under the hero
 * ------------------------------------------------------------------ */
export const trustPillars = [
  { label: "Automation Solutions", href: "/automation" },
  { label: "Engineering Solutions", href: "/engineering-lab-equipment" },
  { label: "Water Solutions", href: "/water-solutions" },
  { label: "Security Solutions", href: "/security-solutions" },
  { label: "Student Projects", href: "/college-projects" },
];

/* ------------------------------------------------------------------ *
 * Statistics
 *
 * IMPORTANT: these are EDITABLE PLACEHOLDERS, not verified business
 * figures. Replace `value` with real numbers before going live, or set
 * `value: null` to hide a tile entirely.
 * ------------------------------------------------------------------ */
export type Stat = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  note?: string;
};

export const homeStats: Stat[] = [
  { label: "Automation Solutions", value: 150, suffix: "+", note: "placeholder" },
  { label: "Engineering Projects", value: 200, suffix: "+", note: "placeholder" },
  { label: "Technology Solutions", value: 50, suffix: "+", note: "placeholder" },
  { label: "Customer Support", value: 24, suffix: "/7", note: "placeholder" },
];

/* ------------------------------------------------------------------ *
 * Our Process (spec section 29)
 * ------------------------------------------------------------------ */
export const processSteps = [
  {
    number: "01",
    title: "Requirement",
    body: "We start by understanding the site, the load, the environment and exactly what the system has to achieve.",
  },
  {
    number: "02",
    title: "Consultation",
    body: "A technical discussion on options, feasibility and budget - with a clear recommendation, not a catalogue.",
  },
  {
    number: "03",
    title: "Design",
    body: "System layout, component selection, wiring schematic and control logic are documented before anything is ordered.",
  },
  {
    number: "04",
    title: "Development / Installation",
    body: "Fabrication, programming and on-site installation carried out by our own engineering team.",
  },
  {
    number: "05",
    title: "Testing",
    body: "Functional testing, safety-sensor verification, load trials and handover documentation.",
  },
  {
    number: "06",
    title: "Support",
    body: "Training for your team, preventive maintenance schedules and responsive service when you need it.",
  },
];

/* ------------------------------------------------------------------ *
 * Core values / expertise (About page)
 * ------------------------------------------------------------------ */
export const coreValues = [
  { title: "Innovation", body: "We keep pace with control platforms, sensing and AI so our clients do not have to." },
  { title: "Quality", body: "Specified components, correct sizing and clean installation practice on every job." },
  { title: "Reliability", body: "Systems designed to run daily for years, with fail-safes and manual overrides." },
  { title: "Engineering Excellence", body: "Every deployment is documented, calculated and testable - never improvised." },
  { title: "Customer Satisfaction", body: "Clear scope, honest timelines and a single point of technical contact." },
  { title: "Technical Support", body: "Post-installation service, spares and troubleshooting handled by the people who built it." },
];

export const industries = [
  "Residential Homes & Villas",
  "Apartments & Gated Communities",
  "Factories & Manufacturing Units",
  "Warehouses & Logistics Parks",
  "Commercial Offices",
  "Engineering Colleges & Polytechnics",
  "Schools & Training Institutes",
  "Hospitals & Clinics",
  "Hotels & Resorts",
  "Retail & Showrooms",
  "Parking Facilities",
  "Government & Institutional Campuses",
];
