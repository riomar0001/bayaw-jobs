export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Recruiter";
  avatar?: string;
  joinedAt: string;
  lastActive: string;
  status: "Active" | "Pending" | "Inactive";
}

export const mockAdmins: AdminUser[] = [
  {
    id: "1",
    name: "Rayan Osman",
    email: "rayan.osman@bayawjobs.com",
    role: "Owner",
    joinedAt: "2023-01-15",
    lastActive: "2024-01-25",
    status: "Active",
  },
  {
    id: "2",
    name: "Sofia Reyes",
    email: "sofia.reyes@bayawjobs.com",
    role: "Admin",
    joinedAt: "2023-03-20",
    lastActive: "2024-01-24",
    status: "Active",
  },
  {
    id: "3",
    name: "Marco Vitale",
    email: "marco.vitale@bayawjobs.com",
    role: "Recruiter",
    joinedAt: "2023-06-10",
    lastActive: "2024-01-22",
    status: "Active",
  },
  {
    id: "4",
    name: "Aisha Tan",
    email: "aisha.tan@bayawjobs.com",
    role: "Recruiter",
    joinedAt: "2023-08-05",
    lastActive: "2024-01-20",
    status: "Active",
  },
  {
    id: "5",
    name: "Daniel Park",
    email: "daniel.park@bayawjobs.com",
    role: "Recruiter",
    joinedAt: "2023-11-01",
    lastActive: "2024-01-18",
    status: "Active",
  },
  {
    id: "6",
    name: "Priya Nair",
    email: "priya.nair@bayawjobs.com",
    role: "Recruiter",
    joinedAt: "2024-01-10",
    lastActive: "2024-01-10",
    status: "Pending",
  },
  {
    id: "7",
    name: "Lucas Ferreira",
    email: "lucas.ferreira@bayawjobs.com",
    role: "Admin",
    joinedAt: "2023-07-18",
    lastActive: "2023-12-30",
    status: "Inactive",
  },
];
