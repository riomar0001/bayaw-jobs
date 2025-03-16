import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const JobDetails = () => {
  return (
    <div className="p-12">
      <Link to={"/find-jobs/"}>
        <Button className="mb-3">
          <ArrowLeft size={15} />
          Go Back
        </Button>
      </Link>

      <div className="flex gap-x-5">
        <section className="flex-1">
          <div className="bg-white border border-neutral-300 rounded-lg w-full px-12 py-10">
            <div className="mb-8">
              <h1 className="text-2xl font-bold">Job Details</h1>
              <h1 className="text-base font-normal text-neutral-500">
                View details of the Job Offer below.
              </h1>
            </div>

            <div className="mt-4">
              <h1 className="font-semibold">Job Status</h1>
              <h1 className="text-neutral-500">Open</h1>
            </div>

            <div className="mt-4">
              <h1 className="font-semibold">Job Posted Date</h1>
              <h1 className="text-neutral-500">Yesterday</h1>
            </div>

            <div className="mt-4">
              <h1 className="font-semibold">Company</h1>
              <h1 className="text-neutral-500">Bayaw</h1>
            </div>

            <div className="mt-4">
              <h1 className="font-semibold">Position</h1>
              <h1 className="text-neutral-500">Standing Position</h1>
            </div>

            <div className="mt-4">
              <h1 className="font-semibold">Job Description</h1>
              <h1 className="text-neutral-500">Standing Position</h1>
            </div>

            <div className="mt-4">
              <h1 className="font-semibold">Job Category</h1>
              <h1 className="text-neutral-500">On Site</h1>
            </div>
            <div className="mt-4">
              <h1 className="font-semibold">Job Address</h1>
              <h1 className="text-neutral-500">Calinan</h1>
            </div>
            <div className="mt-4">
              <h1 className="font-semibold">Salary Range</h1>
              <h1 className="text-neutral-500">1 Slp</h1>
            </div>
            <div className="mt-4">
              <h1 className="font-semibold">Work Schedule</h1>
              <h1 className="text-neutral-500">Full Time</h1>
            </div>
          </div>
        </section>

        <section>
          <div className="bg-white border border-neutral-300 rounded-lg p-6">
            <h1 className="font-semibold">Actions</h1>
            <h1 className="font-light text-neutral-500">
              Perform actions on the job below.
            </h1>
            <hr className="my-5" />
            <Button className="w-full">Apply Job</Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default JobDetails;
