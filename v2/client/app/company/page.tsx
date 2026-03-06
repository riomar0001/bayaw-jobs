"use client";

import { Briefcase, Users, UserCheck, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/company/dashboard/layout/page-header";
import { StatsCard } from "@/components/company/dashboard/dashboard/stats-card";
import { RecentApplicantsList } from "@/components/company/dashboard/dashboard/recent-applicants-list";
import { RecentJobsList } from "@/components/company/dashboard/dashboard/recent-jobs-list";
import { AnalyticsChart } from "@/components/company/dashboard/dashboard/analytics-chart";
import { ApplicationPipeline } from "@/components/company/dashboard/dashboard/application-pipeline";
import { getQuickStats } from "@/data";

export default function DashboardPage() {
  const stats = getQuickStats();

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your recruitment activities"
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Jobs"
            value={stats.totalJobs}
            description={`${stats.activeJobs} active jobs`}
            icon={Briefcase}
          />
          <StatsCard
            title="Total Applicants"
            value={stats.totalApplicants}
            description="Across all job postings"
            icon={Users}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="New This Week"
            value={stats.newThisWeek}
            description="New applications received"
            icon={TrendingUp}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Interviews Scheduled"
            value={stats.interviewsScheduled}
            description={`${stats.offersExtended} offers extended`}
            icon={UserCheck}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <AnalyticsChart />
          <ApplicationPipeline />
        </div>

        {/* Recent Lists Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentApplicantsList />
          <RecentJobsList />
        </div>
      </div>
    </>
  );
}
