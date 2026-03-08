"use client";

import { useState, useEffect, useCallback } from "react";
import { Footer } from "@/components/shared/footer";
import { CompanyCard } from "@/components/home/company-card";
import { Pagination } from "@/components/shared/pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Building2, Loader2 } from "lucide-react";
import { businessService } from "@/api/services/business.service";
import type { CompanyListItem, PaginationMeta } from "@/api/types";

const COMPANIES_PER_PAGE = 9;

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyListItem[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const result = await businessService.getCompanies({
        page: currentPage,
        limit: COMPANIES_PER_PAGE,
        ...(searchQuery && { search: searchQuery }),
        ...(industryFilter !== "all" && { industry: industryFilter }),
      });
      setCompanies(result.companies);
      setIndustries(result.industries);
      setMeta(result.meta);
    } catch {
      setCompanies([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, industryFilter]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleIndustryChange = (value: string) => {
    setIndustryFilter(value);
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
        <div className="text-center mb-8 mt-10">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Explore Top Companies
          </h1>
          <p className="text-muted-foreground text-lg">
            {meta
              ? `Discover ${meta.total} companies hiring for great opportunities`
              : "Discover companies hiring for great opportunities"}
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Industry Filter */}
            <div className="w-full sm:w-64">
              <Select
                value={industryFilter}
                onValueChange={handleIndustryChange}
              >
                <SelectTrigger>
                  <Building2 className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Companies Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : companies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="mt-10">
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
              No companies found matching your criteria. Try adjusting your
              search.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
