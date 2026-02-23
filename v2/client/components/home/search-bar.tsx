"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";

interface SearchBarProps {
  onSearch?: (jobTitle: string, location: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(jobTitle, location);
    } else {
      console.log("Search:", { jobTitle, location });
    }
  };

  return (
    <div className="relative">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-xl" />

      <div className="relative bg-card/80 backdrop-blur-sm shadow-2xl border border-primary/20 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Job title or keyword"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="pl-11 h-12 border focus:border-primary transition-colors text-base"
            />
          </div>

          <div className="flex-1 relative group">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-11 h-12 border focus:border-primary transition-colors text-base"
            />
          </div>

          <Button
            size="lg"
            onClick={handleSearch}
            className="md:px-10 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Search className="mr-2 h-5 w-5" />
            Search Jobs
          </Button>
        </div>

        {/* Popular Searches */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Popular:</span>
          <button className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors">
            Remote
          </button>
          <button className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors">
            Engineering
          </button>
          <button className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors">
            Design
          </button>
          <button className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors">
            Marketing
          </button>
        </div>
      </div>
    </div>
  );
}
