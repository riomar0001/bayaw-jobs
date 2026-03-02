import { Crown, Shield } from "lucide-react";
import { AdminUser } from "@/data/mock-admins";

export const roleConfig: Record<
  AdminUser["role"],
  { label: string; color: string; icon: React.ElementType }
> = {
  Owner: {
    label: "Owner",
    color: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    icon: Crown,
  },
  Admin: {
    label: "Admin",
    color: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    icon: Shield,
  },
  Recruiter: {
    label: "Recruiter",
    color: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
    icon: Shield,
  },
};
