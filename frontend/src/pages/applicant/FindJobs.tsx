import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import JobsPickCard from "@/components/customs/landing/cards/JobsPickCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JobsPickItems } from "@/constants";
import { Search } from "lucide-react";

const FindJobs = () => {
  const navigate = useNavigate(); 
  const location = useLocation(); 
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [location.search]);

  const filteredJobs = useMemo(() => {
    if (!searchTerm.trim()) return JobsPickItems;
    
    const lowerCaseSearch = searchTerm.toLowerCase();
    return JobsPickItems.filter(job => 
      job.jobtitle.toLowerCase().includes(lowerCaseSearch) ||
      job.company.toLowerCase().includes(lowerCaseSearch) ||
      job.salary.toString().includes(lowerCaseSearch)
    );
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/find-jobs?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="bg-neutral-100 h-min">
      <div className="text-center space-y-6 px-24 pt-20">
        <h1 className="text-7xl font-semibold">Find Jobs</h1>
        <h1 className="text-2xl text-neutral-700 font-light">
          Search and find your dream job is now easier than ever. Just browse a
          job and apply if you need to.
        </h1>
      </div>

      <form onSubmit={handleSearch} className="flex items-center justify-center mt-16 space-x-2 mb-16">
        <div className="relative flex items-center w-96">
          <Search className="absolute left-3" color="gray" size={20} />
          <Input
            placeholder="Job title, Salary, or Companies"
            className="h-12 w-full pl-10 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button type="submit" className="bg-lochmara-500 h-12 w-28">Find Job</Button>
      </form>

      <div className="w-full h-auto px-16 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((item) => (
              <a href={`/find-jobs/details`} key={item.id}>
                <JobsPickCard
                  jobtitle={item.jobtitle}
                  company={item.company}
                  type={item.type}
                  companystatus={item.companystatus}
                  location={item.location}
                  salary={item.salary}
                  category={item.category}
                  timestamp={item.timestamp}
                  image={item.image}
                />
              </a>
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-xl text-gray-500">No jobs found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindJobs;
