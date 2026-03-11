import { Users, Building2, UserCheck, Briefcase, FileText, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/company/dashboard/dashboard/stats-card';

export interface SystemStats {
  total_users: number;
  total_businesses: number;
  total_applicants: number;
  total_jobs: number;
  total_applications: number;
  new_users_this_week: number;
}

interface SystemStatsProps {
  stats: SystemStats;
}

export function SystemStats({ stats }: SystemStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-6">
      <StatsCard
        title="Total Users"
        value={stats.total_users}
        description={`+${stats.new_users_this_week} this week`}
        icon={Users}
      />
      <StatsCard
        title="Businesses"
        value={stats.total_businesses}
        description="Registered companies"
        icon={Building2}
      />
      <StatsCard
        title="Applicants"
        value={stats.total_applicants}
        description="Registered job seekers"
        icon={UserCheck}
      />
      <StatsCard
        title="Total Jobs"
        value={stats.total_jobs}
        description="Across all companies"
        icon={Briefcase}
      />
      <StatsCard
        title="Applications"
        value={stats.total_applications}
        description="Total job applications"
        icon={FileText}
      />
      <StatsCard
        title="New This Week"
        value={stats.new_users_this_week}
        description="New user registrations"
        icon={TrendingUp}
      />
    </div>
  );
}
