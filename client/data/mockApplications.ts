export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "interview"
  | "offer"
  | "rejected";

export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  location: string;
  salary: string;
  type: string;
  appliedDate: string;
  status: ApplicationStatus;
  description: string;
}

export const mockApplications: Application[] = [
  {
    id: "1",
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp",
    companyLogo: "TC",
    location: "San Francisco, CA",
    salary: "$120k - $160k",
    type: "Full-time",
    appliedDate: "2024-01-15",
    status: "reviewing",
    description: "We are looking for an experienced frontend developer...",
  },
  {
    id: "2",
    jobTitle: "Full Stack Engineer",
    company: "StartupXYZ",
    companyLogo: "SX",
    location: "New York, NY",
    salary: "$130k - $170k",
    type: "Full-time",
    appliedDate: "2024-01-12",
    status: "interview",
    description: "Join our fast-growing startup as a full stack engineer...",
  },
  {
    id: "3",
    jobTitle: "React Developer",
    company: "DesignHub",
    companyLogo: "DH",
    location: "Remote",
    salary: "$100k - $140k",
    type: "Contract",
    appliedDate: "2024-01-10",
    status: "pending",
    description: "We need a React developer to join our team...",
  },
  {
    id: "4",
    jobTitle: "UI/UX Developer",
    company: "Creative Studios",
    companyLogo: "CS",
    location: "Austin, TX",
    salary: "$90k - $120k",
    type: "Full-time",
    appliedDate: "2024-01-08",
    status: "rejected",
    description: "Looking for a UI/UX developer with strong design skills...",
  },
];

export const statusConfig: Record<
  ApplicationStatus,
  {
    label: string;
    variant: "secondary" | "default" | "destructive" | "outline";
  }
> = {
  pending: { label: "Pending", variant: "secondary" },
  reviewing: { label: "Under Review", variant: "default" },
  interview: { label: "Interview", variant: "default" },
  offer: { label: "Offer", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
};
