"use client";

import { useState, useEffect, useCallback } from "react";
import { Footer } from "@/components/shared/footer";
import { SearchBar } from "@/components/home/search-bar";
import { JobCard } from "@/components/home/job-card";
import { JobFilters } from "@/components/jobs/job-filters";
import { Pagination } from "@/components/shared/pagination";
import { jobsService } from "@/api/services/jobs.service";
import type { JobSummary, PaginationMeta } from "@/api/types";
import { Loader2 } from "lucide-react";

const JOBS_PER_PAGE = 12;

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [filters, setFilters] = useState({
    jobTypes: [] as string[],
    location: "",
    salaryRange: [0, 200],
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await jobsService.getJobs({
        page: currentPage,
        limit: JOBS_PER_PAGE,
        ...(searchQuery && { search: searchQuery }),
        ...((searchLocation || filters.location) && {
          location: searchLocation || filters.location,
        }),
        ...(filters.jobTypes.length === 1 && {
          employment_type: filters.jobTypes[0],
        }),
        ...(filters.salaryRange[0] > 0 && {
          min_salary: filters.salaryRange[0] * 1000,
        }),
        ...(filters.salaryRange[1] < 200 && {
          max_salary: filters.salaryRange[1] * 1000,
        }),
      });
      setJobs(res.data);
      setMeta(res.meta);
    } catch {
      setJobs([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, searchLocation, filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = (query: string, location: string) => {
    setSearchQuery(query);
    setSearchLocation(location);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Background Decoration */}
      <div className="fixed top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-10 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Find Your Dream Job
          </h1>
          <p className="text-muted-foreground text-lg">
            {meta
              ? `Explore ${meta.total} opportunities from top companies`
              : "Discover opportunities from top companies"}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-20">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-20">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <JobFilters filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : jobs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={meta.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No jobs found matching your criteria. Try adjusting your
                  filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
