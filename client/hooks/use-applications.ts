"use client";

import { useState, useEffect, useCallback } from "react";
import { applicantService } from "@/api/services/applicant.service";
import type {
  Application,
  ApplicationStats,
  ApplicationStatus,
  PaginationMeta,
} from "@/api/types";

interface UseApplicationsReturn {
  applications: Application[];
  stats: ApplicationStats | null;
  meta: PaginationMeta | null;
  isLoading: boolean;
  isStatsLoading: boolean;
  error: string | null;
  page: number;
  setPage: (page: number) => void;
  statusFilter: ApplicationStatus | "all";
  setStatusFilter: (status: ApplicationStatus | "all") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refresh: () => void;
}

const LIMIT = 10;

export function useApplications(): UseApplicationsReturn {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await applicantService.getApplications({
        page,
        limit: LIMIT,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setApplications(res.data);
      setMeta(res.meta);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load applications",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter]);

  const fetchStats = useCallback(async () => {
    setIsStatsLoading(true);
    try {
      const res = await applicantService.getApplicationStats();
      setStats(res);
    } catch {
      // stats failure is non-critical
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  useEffect(() => {
    void fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  const filteredApplications = searchQuery.trim()
    ? applications.filter(
        (app) =>
          app.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.job.department.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : applications;

  return {
    applications: filteredApplications,
    stats,
    meta,
    isLoading,
    isStatsLoading,
    error,
    page,
    setPage,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    refresh: fetchApplications,
  };
}
