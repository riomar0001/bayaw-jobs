import JobDetailsCard from "@/components/customs/applicant/cards/JobDetailsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { images } from "@/constants";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
interface CompanyInformation {
  name: string;
}

interface Company {
  companies_information: CompanyInformation;
}

interface JobDetails {
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
  companies: Company;
}

const JobDetails = () => {
  const { job_id } = useParams();
  const navigate = useNavigate();
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);

  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await axios.get(`/api/jobs/${job_id}`);
        const data = response.data.job;

        console.log("Data", data);

        setJobDetails(data);
        // if (data.success) {
        //     setExperiences(data.experiences || "");
        // }
      } catch (error: any) {
        console.error(error.message);
      }
    };
    const checkIfApplied = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/jobs/applied/${job_id}`,
          {
            withCredentials: true,
          }
        );
        console.log("CHECK IF APPLIED:", response);

        setIsApplied(response.data.applied); // Set applied status
      } catch (error) {
        console.error("Error checking job application status:", error);
      }
    };
    fetchJobData();
    checkIfApplied();
  }, [job_id]);

  const changeTimeZone = (time: any) => {
    if (!time) return "N/A"; // Handle null/undefined cases

    const timeZone = "Asia/Manila"; // Philippines timezone
    try {
      return format(toZonedTime(new Date(time), timeZone), "MMMM dd, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const handleApplyJob = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post(`/api/jobs/apply/${job_id}`, {
        withCredentials: true,
      });

      // console.log("RESPONSE DATA:", response.data);
      // navigate("/find-jobs");
      toast.success("Job Applied Successfully!", {
        description: "Wait for the employer's response to proceed.",
        classNames: {
          icon: "text-teal-800",
          title: "text-teal-800",
          description: "text-teal-800",
          success: "bg-teal-100",
        },
      });

      setTimeout(() => {
        navigate(-1);
        // window.location.reload();
      }, 1000);
    } catch (err: any) {
      console.log(err);

      // Extract error message
      const errorMessage =
        err.response?.data?.message || "An error occurred while applying.";

      // Show specific error if user already applied
      if (errorMessage === "You already applied to this job.") {
        toast.warning("Application Notice", {
          description: errorMessage,
          classNames: {
            icon: "text-amber-800",
            title: "text-amber-800",
            description: "text-amber-800",
            warning: "bg-amber-100",
          },
        });
      } else {
        // General error handling
        toast.error("Applying Job Failed!", {
          description: errorMessage,
          classNames: {
            icon: "text-red-800",
            title: "text-red-800",
            description: "text-red-800",
            error: "bg-red-100",
          },
        });
      }
    }
  };

  const cancelJobApplication = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/jobs/cancel/${job_id}`,
        {
          withCredentials: true,
        }
      );
      console.log("Cancel:", response);

      toast.success("Job Canceled Successfully!", {
        description: "You canceled your job application.",
        classNames: {
          icon: "text-teal-800",
          title: "text-teal-800",
          description: "text-teal-800",
          success: "bg-teal-100",
        },
      });

      setTimeout(() => {
        navigate(-1);
        // window.location.reload();
      }, 1000);

      // setIsApplied(response.data.applied); // Set applied status
    } catch (error) {
      console.error("Error checking job application status:", error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-sky-50 to-neutral-100 min-h-screen px-6 py-8 md:px-12 lg:px-24 xl:px-36">
      <Button
        variant="outline"
        className="flex items-center gap-2 hover:bg-sky-50 transition-colors mb-6"
        onClick={() => window.history.back()}
      >
        <ArrowLeft size={16} className="text-lochmara-500" />
        <span>Back to Jobs</span>
      </Button>

      <div className="flex flex-col lg:flex-row gap-6">
        <JobDetailsCard
          position={jobDetails?.title || "Loading..."}
          company={
            jobDetails?.companies.companies_information.name || "Loading..."
          }
          // image={
          //   images.sample_company_1
          // }
          category={jobDetails?.category || "Loading..."}
          location={jobDetails?.location || "Loading..."}
          schedule={jobDetails?.work_schedule || "Loading..."}
          minSalary={jobDetails?.salary_from.toString() || "Loading..."}
          maxSalary={jobDetails?.salary_to.toString() || ""}
          description={
            jobDetails?.description ? jobDetails?.description : "Loading..."
          }
          date={changeTimeZone(jobDetails?.updated_at).toString()}
          status="Active"
        />

        <section className="w-full lg:w-80">
          <Card className="border-neutral-200 shadow-sm">
            <CardHeader className="border-b border-neutral-100">
              <CardTitle className="text-lg">Actions</CardTitle>
              <p className="text-sm text-neutral-500">
                Apply for this position
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <Button
                onClick={isApplied ? cancelJobApplication : handleApplyJob}
                className={`w-full ${
                  isApplied
                    ? "bg-red-500 hover:bg-red-700"
                    : "bg-lochmara-500 hover:bg-lochmara-600"
                } transition-colors py-6 text-base font-medium`}
              >
                {isApplied ? "Cancel Application" : "Apply Now"}
              </Button>

              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <span className="font-medium">Note:</span> Make sure your
                  profile is up to date before applying.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-center">
                <Button
                  variant="ghost"
                  className="text-neutral-500 hover:text-lochmara-500 text-sm"
                >
                  Save for later
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default JobDetails;
