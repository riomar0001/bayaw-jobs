import { Button } from "@/components/ui/button";
import { ActivePositionsSample } from "@/constants";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { CardContent } from "@/components/ui/card";
import Spinner from "@/components/customs/employer/Spinner";

// import { logos } from "@/constants";

const getStatusStyle = (status: any) => {
  return status === "pending"
    ? "bg-tussock-100 text-tussock-500"
    : status === "hired"
    ? "bg-lochmara-100 text-lochmara-500"
    : status === "rejected"
    ? "bg-thunderbird-100 text-thunderbird-500"
    : "";
};

const ActivePositions = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/jobs/appliedJobs", {
          withCredentials: true,
        });
        const data = response.data.appliedJobs;

        setAppliedJobs(data || []);
        // console.log("Data", data);
      } catch (error: any) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  return (
    <div className="bg-white border border-neutral-100 w-[380px] h-auto rounded-lg p-6">
      <h1 className="text-lg font-medium">Applied Jobs</h1>

      {loading ? (
        <CardContent className="pt-6 h-80 flex items-center justify-center">
          <Spinner />
        </CardContent>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {appliedJobs?.slice(0, 3).map((job: any) => (
            <Link to={"/find-jobs/details/" + job.job_offers.id} key={job.id}>
              <div className="flex items-center justify-between my-2 p-3 rounded-lg hover:bg-neutral-200 transition-colors duration-300 cursor-pointer">
                <div className="space-y-1">
                  <h1 className="text-base font-medium text-black">
                    {job.job_offers.title}
                  </h1>
                  <h1 className="text-base font-normal text-neutral-500">
                    {job.job_offers.companies.companies_information.name}
                  </h1>
                </div>

                <div
                  className={`py-2 px-4 w-fit rounded-md ${getStatusStyle(
                    job.status
                  )}`}
                >
                  <h1 className="font-medium text-sm">{job.status}</h1>
                </div>
              </div>

              {job.id !==
                ActivePositionsSample.slice(0, 2)[
                  ActivePositionsSample.slice(0, 2).length - 1
                ].id && <hr />}
            </Link>
          ))}
        </div>
      )}

      <Button
        onClick={() => {
          navigate("/applicant/appliedJobs");
        }}
        className="bg-lochmara-500 text-white w-full rounded-full hover:bg-lochmara-500/80 my-3"
      >
        Show All <ChevronRight />{" "}
      </Button>
    </div>
  );
};

export default ActivePositions;
