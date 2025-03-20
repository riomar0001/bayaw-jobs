import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import JobsPickCard from "@/components/customs/landing/cards/JobsPickCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { JobsPickItems } from "@/constants";
import { images } from "@/constants";
import { Search } from "lucide-react";
import axios from "axios";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
interface CompanyInfo {
  id: string;
  company_account_id: string;
  name: string;
  address: string;
  description: string;
  contact_no: string;
  email: string;
  industry_id: string;
  created_at: string;
  updated_at: string;
}

interface Companies {
  companies_information: CompanyInfo;
}
interface JobListing {
  id: string;
  company_account_id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  salary_from: number;
  salary_to: number;
  work_schedule: string;
  years_exp: number;
  is_closed: boolean;
  created_at: string;
  updated_at: string;
  companies: Companies;
}

const FindJobs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState<JobListing[]>([]);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const response = await axios.get(`/api/jobs/`);
        const data = response.data.allJobs;

        console.log("Data", data);

        setJobs(data);
        // if (data.success) {
        //     setExperiences(data.experiences || "");
        // }
      } catch (error: any) {
        console.error(error.message);
      }
    };

    fetchAllJobs();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [location.search]);

  const filteredJobs = useMemo(() => {
    if (!searchTerm.trim()) return jobs;

    const lowerCaseSearch = searchTerm.toLowerCase();
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(lowerCaseSearch) ||
        job.location.toLowerCase().includes(lowerCaseSearch) ||
        job.salary_from.toString().includes(lowerCaseSearch) ||
        job.salary_to.toString().includes(lowerCaseSearch)
    );
  }, [searchTerm, jobs]);

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

      <form
        onSubmit={handleSearch}
        className="flex items-center justify-center mt-16 space-x-2 mb-16"
      >
        <div className="relative flex items-center w-96">
          <Search className="absolute left-3" color="gray" size={20} />
          <Input
            placeholder="Job title, Salary, or Companies"
            className="h-12 w-full pl-10 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button type="submit" className="bg-lochmara-500 h-12 w-28">
          Find Job
        </Button>
      </form>

      <div className="w-full h-auto px-16 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((item) => {
              // Convert updated_at to Philippines Time
              const timeZone = "Asia/Manila"; // Philippines timezone
              const updatedAtPHT = format(
                toZonedTime(new Date(item.updated_at), timeZone),
                "MMMM dd, yyyy"
              );
              console.log("ITEM ID:", item.id);
              
              return (
                <a href={`/find-jobs/details/${item.id}`} key={item.id}>
                  <JobsPickCard
                    jobtitle={item.title}
                    company={item.companies?.companies_information.name || ""}
                    type={item.work_schedule}
                    companystatus="Active"
                    location={item.location}
                    salary={`${item.salary_from} - ${item.salary_to}`}
                    category={item.category.toString()}
                    timestamp={updatedAtPHT} // Use converted timestamp
                    image={images.company_logo}
                  />
                </a>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-xl text-gray-500">
                No jobs found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindJobs;
