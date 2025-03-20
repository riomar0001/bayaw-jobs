import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Briefcase,
  Building,
  Clock,
  DollarSign,
  MapPin,
  UserRoundPen,
} from "lucide-react";
import ApplicantsCard from "./ApplicantsCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useEffect } from "react";
import Spinner from "../Spinner";

interface JobData {
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
}

const JobDetailsCard = ({ jobId }: { jobId: string }) => {
  const [jobData, setJobData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/jobs/${jobId}`);
        if (response.data.success) {
          setJobData(response.data.job);
        } else {
          setError("Failed to load job details");
        }
      } catch (err) {
        setError("An error occurred while fetching job details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <section className="flex-1">
      <Card className="border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
        {loading ? (
          <div>
            <CardContent className="pt-6 h-80 flex items-center justify-center">
              <Spinner />
            </CardContent>
          </div>
        ) : (
          <>
            <CardHeader className="border-b border-neutral-100 pb-6">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                    {jobData.title}
                  </h1>
                  <div className="flex items-center gap-2 text-neutral-500">
                    <Building size={16} className="text-lochmara-400" />
                    <span className="font-medium">Company Name</span>
                    <span className="text-xs text-neutral-400">
                      • Posted{" "}
                      {new Date(jobData.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-8">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-lochmara-50 p-2 rounded-lg">
                    <Briefcase size={18} className="text-lochmara-500" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-700">
                      Job Category
                    </h2>
                    <p className="text-neutral-600">{jobData.category}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-lochmara-50 p-2 rounded-lg">
                    <MapPin size={18} className="text-lochmara-500" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-700">Location</h2>
                    <p className="text-neutral-600">{jobData.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-lochmara-50 p-2 rounded-lg">
                    <DollarSign size={18} className="text-lochmara-500" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-700">
                      Salary Range
                    </h2>
                    <p className="text-neutral-600">
                      ₱{jobData.salary_from} - ₱{jobData.salary_to}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-lochmara-50 p-2 rounded-lg">
                    <Clock size={18} className="text-lochmara-500" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-700">
                      Work Schedule
                    </h2>
                    <p className="text-neutral-600">{jobData.work_schedule}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 border-b border-neutral-100 pb-2">
                    Job Description
                  </h2>
                  <p className="text-neutral-600">{jobData.description}</p>
                </div>

                <div className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <UserRoundPen size={18} className="text-lochmara-500" />
                    <h2 className="text-md font-semibold text-gray-700">
                      Applicants
                    </h2>
                  </div>

                  <div>
                    <Dialog>
                      <DialogTrigger className="w-full space-y-3 text-start">
                        <ApplicantsCard
                          name="Kyle Dellatan"
                          email="kyledellatan@gmail.com"
                          contactNumber="09987654321"
                          applicantId="1"
                        />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            <h1 className="text-2xl font-semibold">
                              Applicant Details
                            </h1>
                            <h1 className="text-gray-500 font-light text-base">
                              Review the applicant's information and access
                              their CV
                            </h1>
                          </DialogTitle>
                          <DialogDescription>
                            <div className="">
                              <h1 className="text-black text-lg">
                                Basic Information
                              </h1>
                              <hr />
                              <div className="space-y-1 my-3">
                                <h1>
                                  Full Name:
                                  <span className="text-lochmara-400">
                                    {" "}
                                    Kyle Dellatan
                                  </span>
                                </h1>
                                <h1>
                                  Username:
                                  <span className="text-lochmara-400">
                                    {" "}
                                    ykylejan
                                  </span>
                                </h1>
                                <h1>
                                  Email:{" "}
                                  <span className="text-lochmara-400">
                                    {" "}
                                    kyledellatan@gmail.com
                                  </span>
                                </h1>
                                <h1>
                                  Contact No:
                                  <span className="text-lochmara-400">
                                    {" "}
                                    09987654321
                                  </span>
                                </h1>
                                <h1>Account Created: 3/17/2025</h1>
                              </div>

                              <h1 className="text-black text-lg">
                                Work Experience
                              </h1>
                              <hr />

                              <div className="space-y-1 my-3">
                                <div className="bg-neutral-50 border border-neutral-300 rounded-md p-3">
                                  <h1>
                                    Company:
                                    <span className="text-lochmara-400">
                                      {" "}
                                      KALMOT
                                    </span>
                                  </h1>
                                  <h1>
                                    Address:
                                    <span className="text-lochmara-400">
                                      {" "}
                                      Davao City
                                    </span>
                                  </h1>
                                  <h1>
                                    Position:
                                    <span className="text-lochmara-400">
                                      {" "}
                                      Frontend Developer, UI/UX
                                    </span>
                                  </h1>
                                  <h1>
                                    Years of Stay:
                                    <span className="text-lochmara-400">
                                      {" "}
                                      6 years
                                    </span>
                                  </h1>
                                </div>
                              </div>

                              <h1 className="text-black text-lg">
                                CV Document
                              </h1>
                              <hr />

                              <div className="my-3">
                                <h1>
                                  Click the button below to view the applicant's
                                  CV.
                                </h1>
                                <Button>View CV</Button>
                              </div>
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </section>
  );
};

export default JobDetailsCard;
