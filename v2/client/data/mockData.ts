import type { Job, Company } from "@/data";

// Mock User Profile
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  desiredPosition: string;
  skills: string[];
  languages: Array<{
    language: string;
    proficiency: "basic" | "conversational" | "fluent" | "native";
  }>;
  status: "actively-looking" | "employed" | "open-to-opportunities";
  currentlyApplyingFor: Array<{
    jobTitle: string;
    company: string;
  }>;
  personalInfo: {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
  };
  education: {
    school: string;
    field: string;
    monthGraduated: string;
    yearGraduated: string;
  };
  experiences: Array<{
    companyName: string;
    position: string;
    fromYear: string;
    toYear?: string;
    currentlyWorking: boolean;
  }>;
  resume: {
    fileName: string;
    fileSize: string;
    uploadedAt: string;
  } | null;
}

export const mockUserProfile: UserProfile = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  age: 28,
  gender: "male",
  desiredPosition: "Senior Frontend Developer",
  skills: ["React", "TypeScript", "Next.js", "Node.js", "Tailwind CSS"],
  languages: [
    { language: "English", proficiency: "native" },
    { language: "Spanish", proficiency: "conversational" },
  ],
  status: "actively-looking",
  currentlyApplyingFor: [
    { jobTitle: "Senior Frontend Developer", company: "TechCorp" },
    { jobTitle: "Full Stack Engineer", company: "StartupXYZ" },
    { jobTitle: "React Developer", company: "DesignHub" },
  ],
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    age: 28,
    gender: "male",
  },
  education: {
    school: "University of California, Berkeley",
    field: "Computer Science",
    monthGraduated: "05",
    yearGraduated: "2018",
  },
  experiences: [
    {
      companyName: "Tech Solutions Inc.",
      position: "Senior Frontend Developer",
      fromYear: "2020",
      toYear: "2024",
      currentlyWorking: false,
    },
    {
      companyName: "Digital Innovations",
      position: "Frontend Developer",
      fromYear: "2018",
      toYear: "2020",
      currentlyWorking: false,
    },
  ],
  resume: {
    fileName: "John_Doe_Resume.pdf",
    fileSize: "2.4 MB",
    uploadedAt: "2024-01-15",
  },
};

// Extended Jobs Data (12 jobs for the jobs page)
export const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $160k",
    description: "We are looking for an experienced frontend developer...",
    postedDate: "2 days ago",
    responsibilities: [],
    requirements: [],
    benefits: [],
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "New York, NY",
    type: "Full-time",
    salary: "$130k - $170k",
    description: "Join our fast-growing startup as a full stack engineer...",
    postedDate: "1 week ago",
    responsibilities: [],
    requirements: [],
    benefits: [],
  },
  {
    id: "3",
    title: "UI/UX Designer",
    company: "DesignHub",
    location: "Remote",
    type: "Contract",
    salary: "$80k - $110k",
    description: "We need a creative UI/UX designer to join our team...",
    postedDate: "3 days ago",
    responsibilities: [],
    requirements: [],
    benefits: [],
  },
  {
    id: "4",
    title: "Backend Developer",
    company: "CloudSystems",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$110k - $150k",
    description: "Looking for a backend developer with Node.js experience...",
    postedDate: "1 day ago",
    responsibilities: [],
    requirements: [],
    benefits: [],
  },
  {
    id: "5",
    title: "DevOps Engineer",
    company: "InfraTech",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$140k - $180k",
    description: "Join our DevOps team to manage cloud infrastructure...",
    postedDate: "5 days ago",
    responsibilities: [],
    requirements: [],
    benefits: [],
  },
  {
    id: "6",
    title: "Mobile Developer (iOS)",
    company: "AppVentures",
    location: "Boston, MA",
    type: "Full-time",
    salary: "$115k - $145k",
    description: "We are hiring an iOS developer to build amazing apps...",
    postedDate: "1 week ago",
    responsibilities: [],
    requirements: [],
    benefits: [],
  },
  {
    id: "7",
    title: "Data Scientist",
    company: "DataMinds",
    location: "Remote",
    type: "Full-time",
    salary: "$125k - $165k",
    description: "Looking for a data scientist with ML experience...",
    postedDate: "4 days ago",
    responsibilities: [],
    requirements: [],
    benefits: [],
  },
  {
    id: "8",
    title: "Product Manager",
    company: "ProductCo",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$135k - $175k",
    description: "Lead product development for our flagship product...",
    postedDate: "2 days ago",
    responsibilities: [],
    requirements: [],
    benefits: [],
  },
  {
    id: "9",
    title: "QA Engineer",
    company: "QualityFirst",
    location: "Chicago, IL",
    type: "Part-time",
    salary: "$70k - $95k",
    description: "We need a QA engineer to ensure product quality...",
    postedDate: "6 days ago",
    responsibilities: [],
    requirements: [],
    benefits: [],
  },
  {
    id: "10",
    title: "Marketing Specialist",
    company: "GrowthLab",
    location: "Miami, FL",
    type: "Full-time",
    salary: "$65k - $90k",
    description: "Join our marketing team to drive growth...",
    postedDate: "1 week ago",
    responsibilities: [],
    requirements: [],
    benefits: [],
  },
  {
    id: "11",
    title: "Cybersecurity Analyst",
    company: "SecureNet",
    location: "Washington, DC",
    type: "Full-time",
    salary: "$105k - $140k",
    description: "Protect our systems from cyber threats...",
    postedDate: "3 days ago",
    responsibilities: [],
    requirements: [],
    benefits: [],
  },
  {
    id: "12",
    title: "AI/ML Engineer",
    company: "FutureTech",
    location: "Remote",
    type: "Full-time",
    salary: "$150k - $200k",
    description: "Build cutting-edge AI solutions...",
    postedDate: "2 days ago",
    responsibilities: [],
    requirements: [],
    benefits: [],
  },
];

// Extended Companies Data (9 companies for the companies page)
export const companies: Company[] = [
  {
    id: "1",
    name: "TechCorp",
    logo: "TC",
    industry: "Technology",
    location: "San Francisco, CA",
    employeeCount: "1,000-5,000",
    openPositions: 24,
    website: "https://techcorp.example.com",
  },
  {
    id: "2",
    name: "StartupXYZ",
    logo: "SX",
    industry: "Software",
    location: "New York, NY",
    employeeCount: "50-200",
    openPositions: 12,
    website: "https://startupxyz.example.com",
  },
  {
    id: "3",
    name: "DesignHub",
    logo: "DH",
    industry: "Design",
    location: "Austin, TX",
    employeeCount: "200-500",
    openPositions: 8,
    website: "https://designhub.example.com",
  },
  {
    id: "4",
    name: "CloudSystems",
    logo: "CS",
    industry: "Cloud Computing",
    location: "Boston, MA",
    employeeCount: "500-1,000",
    openPositions: 18,
    website: "https://cloudsystems.example.com",
  },
  {
    id: "5",
    name: "InfraTech",
    logo: "IT",
    industry: "Infrastructure",
    location: "Seattle, WA",
    employeeCount: "1,000-5,000",
    openPositions: 15,
    website: "https://infratech.example.com",
  },
  {
    id: "6",
    name: "AppVentures",
    logo: "AV",
    industry: "Mobile Apps",
    location: "Remote",
    employeeCount: "100-500",
    openPositions: 10,
    website: "https://appventures.example.com",
  },
  {
    id: "7",
    name: "DataMinds",
    logo: "DM",
    industry: "Data Science",
    location: "San Francisco, CA",
    employeeCount: "200-500",
    openPositions: 14,
    website: "https://dataminds.example.com",
  },
  {
    id: "8",
    name: "ProductCo",
    logo: "PC",
    industry: "Product Management",
    location: "New York, NY",
    employeeCount: "500-1,000",
    openPositions: 9,
    website: "https://productco.example.com",
  },
  {
    id: "9",
    name: "QualityFirst",
    logo: "QF",
    industry: "Quality Assurance",
    location: "Chicago, IL",
    employeeCount: "50-200",
    openPositions: 6,
    website: "https://qualityfirst.example.com",
  },
];

// Login History
export interface LoginHistoryEntry {
  id: string;
  device: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
  ip: string;
  location: string;
  date: string;
  current: boolean;
}

export const mockLoginHistory: LoginHistoryEntry[] = [
  {
    id: "1",
    device: "desktop",
    browser: "Chrome 121",
    os: "Windows 11",
    ip: "192.168.1.101",
    location: "San Francisco, CA, USA",
    date: "2026-02-22T11:47:00Z",
    current: true,
  },
  {
    id: "2",
    device: "mobile",
    browser: "Safari 17",
    os: "iOS 17",
    ip: "192.168.1.55",
    location: "San Francisco, CA, USA",
    date: "2026-02-21T08:15:00Z",
    current: false,
  },
  {
    id: "3",
    device: "desktop",
    browser: "Firefox 122",
    os: "macOS Sonoma",
    ip: "10.0.0.42",
    location: "New York, NY, USA",
    date: "2026-02-19T20:03:00Z",
    current: false,
  },
  {
    id: "4",
    device: "tablet",
    browser: "Chrome 121",
    os: "Android 14",
    ip: "172.16.0.22",
    location: "Los Angeles, CA, USA",
    date: "2026-02-17T14:30:00Z",
    current: false,
  },
  {
    id: "5",
    device: "desktop",
    browser: "Edge 121",
    os: "Windows 10",
    ip: "203.0.113.12",
    location: "Austin, TX, USA",
    date: "2026-02-15T09:55:00Z",
    current: false,
  },
];
