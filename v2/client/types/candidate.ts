export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  age: number;
  title: string;
  company: string;
  profilePhoto: string;
  linkedInUrl?: string;

  personalInfo: PersonalInfo;
  resume?: Resume;
  experiences: Experience[];
  education: Education[];
  preferredPositions: PreferredPosition[];
  skills: Skill[];
  languages: Language[];
  activePositions: ActivePosition[];
  careerStatus: CareerStatus;
}

export interface PersonalInfo {
  email: string;
  phone: string;
  countryCode: string;
  dateOfBirth: string;
  age: number;
  salaryExpectation: number;
  currency: string;
  locations: string[];
  workTypes: WorkType[];
}

export type WorkType =
  | "Remote"
  | "Fulltime"
  | "Part-Time"
  | "Internship"
  | "Contract"
  | "Freelance";

export interface Resume {
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface Experience {
  id: string;
  companyName: string;
  companyLogo?: string;
  position: string;
  employmentType:
    | "Fulltime"
    | "Part-time"
    | "Contract"
    | "Freelance"
    | "Internship";
  duration: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
}

export interface Education {
  id: string;
  institutionName: string;
  institutionLogo?: string;
  degree: string;
  field?: string;
  date: string;
  location?: string;
}

export interface PreferredPosition {
  id: string;
  name: string;
  yearsExperience: number;
  isSelected: boolean;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Language {
  id: string;
  code: string;
  name: string;
  proficiency:
    | "Native Language"
    | "Fluent"
    | "Advanced"
    | "Intermediate"
    | "Basic";
}

export interface ActivePosition {
  id: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  status: "Interview" | "Invited" | "Applied" | "Rejected" | "Offered";
}

export type CareerStatus =
  | "actively-seeking"
  | "open-to-opportunities"
  | "not-looking"
  | "employed-not-looking";
