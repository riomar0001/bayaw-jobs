"use client";

import { useState } from "react";
import { Footer } from "@/components/shared/footer";
import { SearchBar } from "@/components/home/search-bar";
import { JobCard } from "@/components/home/job-card";
import { JobFilters } from "@/components/jobs/job-filters";
import { Pagination } from "@/components/shared/pagination";
import { jobs } from "@/data";

const JOBS_PER_PAGE = 12;

export default function JobsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    jobTypes: [] as string[],
    location: "",
    salaryRange: [0, 200],
  });

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesJobType =
      filters.jobTypes.length === 0 || filters.jobTypes.includes(job.type);

    const matchesLocation =
      filters.location === "" ||
      job.location.toLowerCase().includes(filters.location.toLowerCase());

    return matchesSearch && matchesJobType && matchesLocation;
  });

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const paginatedJobs = filteredJobs.slice(
    startIndex,
    startIndex + JOBS_PER_PAGE,
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
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
            Explore {filteredJobs.length} opportunities from top companies
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
            <JobFilters filters={filters} onFilterChange={setFilters} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Jobs Grid */}
            {paginatedJobs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
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
