import { JobsPickItems } from "@/constants";
import JobsPickCard from "../cards/JobsPickCard";

import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { JobsPickItems } from "@/constants";
import { Search } from "lucide-react";
import axios from "axios";
import { format } from "date-fns";
import { logos } from "@/constants";

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
  company: string
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

const JobsPick = () => {
  
  const [jobs, setJobs] = useState<JobListing[]>([]);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const response = await axios.get(`/api/jobs/all/picks`);
        const data = response.data?.shuffledJobs;

        console.log("Data", data);

        setJobs(data);
        
      } catch (error: any) {
        console.error(error.message);
      }
    };

    fetchAllJobs();
  }, []); // Empty dependency array ensures useEffect runs only once

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center px-24 mb-10">
      <h1 className="text-4xl font-medium text-center mb-8">
        Jobs picks for you
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
      {jobs.length > 0 ? (
            jobs.map((item) => {
              // Convert updated_at to Philippines Time
              const timeZone = "Asia/Manila"; // Philippines timezone
              const updatedAtPHT = format(
                toZonedTime(new Date(item.updated_at), timeZone),
                "MMMM dd, yyyy"
              );
              
              return (
                <a href={`/find-jobs/details/${item.id}`} key={item.id}>
                  <JobsPickCard
                    jobtitle={item.title}
                    company={item.companies?.companies_information.name || ""}
                    type={item.work_schedule}
                    companystatus="Active"
                    location={item.location}
                    salary={`₱${item.salary_from} - ₱${item.salary_to}`}
                    category={item.category.toString()}
                    timestamp={updatedAtPHT} // Use converted timestamp
                    image={logos.brandlogo}
                  />
                </a>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-2xl font-bold text-gray-500">
                Loading Job Picks...
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default JobsPick;
