"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Footer } from "@/components/shared/footer";
import { ArrowLeft, Briefcase, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { ApplicationFilters } from "@/components/applicants/applications/application-filters";
import { ApplicationStats } from "@/components/applicants/applications/application-stats";
import { ApplicationCard } from "@/components/applicants/applications/application-card";
import { useApplications } from "@/hooks/use-applications";

export default function ApplicationsPage() {
  const router = useRouter();
  const {
    applications,
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
  } = useApplications();

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Applications</h1>
          <p className="text-muted-foreground">
            Track and manage all your job applications in one place
          </p>
        </div>

        <ApplicationStats stats={stats} isLoading={isStatsLoading} />

        <ApplicationFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        {/* Error */}
        {error && (
          <Card className="mb-4 border-destructive/50">
            <CardContent className="p-4 flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Applications List */}
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <Skeleton className="w-14 h-14 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-64" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <Skeleton className="h-9 w-24 shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : applications.length > 0 ? (
            applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No applications found
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "You haven't applied to any jobs yet"}
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <Button onClick={() => router.push("/jobs")}>
                    Browse Jobs
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Page {meta.page} of {meta.totalPages} &mdash; {meta.total} total
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!meta.hasPreviousPage}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!meta.hasNextPage}
                onClick={() => setPage(page + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
