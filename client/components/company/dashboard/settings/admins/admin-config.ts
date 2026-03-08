import { Crown, Shield } from 'lucide-react';

export const roleConfig: Record<string, { label: string; color: string; icon: React.ElementType }> =
  {
    OWNER: {
      label: 'Owner',
      color: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
      icon: Crown,
    },
    ADMIN: {
      label: 'Admin',
      color: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      icon: Shield,
    },
    RECRUITER: {
      label: 'Recruiter',
      color: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
      icon: Shield,
    },
  };
