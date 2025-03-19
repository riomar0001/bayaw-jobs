import JobDetailsCard from "@/components/customs/employer/cards/JobDetailsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { images } from "@/constants";
import { ArrowLeft, Pencil } from "lucide-react";
import { Link } from "react-router-dom";

const JobDetailsEmployer = () => {
  return (
    <div className="min-h-screen px-6 py-8 md:px-12 lg:px-24 xl:px-36">
      <Link to={"/employer/jobs"} className="inline-block mb-6">
        <Button variant="outline" className="flex items-center gap-2 hover:bg-sky-50 transition-colors">
          <ArrowLeft size={16} className="text-lochmara-500" />
          <span>Back to Jobs</span>
        </Button>
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        <JobDetailsCard
          position="Mobile App Developer"
          company="KONAMI"
          image={images.sample_company_1}
          category="On-site"
          location="Calinan"
          schedule="Full Time"
          minSalary="40000"
          maxSalary="75000"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, deserunt illum inventore, vero molestiae maxime recusandae tenetur, minus molestias iusto quidem! Ex inventore eos labore sequi quos. Architecto, dolores ipsa!"
          status="Active"
        />

        <section className="w-full lg:w-80">
          <Card className="border-neutral-200 shadow-sm">
            <CardHeader className="border-b border-neutral-100">
              <CardTitle className="text-lg">Actions</CardTitle>
              <p className="text-sm text-neutral-500">Perform actions on the job offer below</p>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <Link to={"/employer/jobs/edit-job"}>
                <Button className="w-full bg-transparent transition-colors py-5 text-base text-black hover:text-white border border-neutral-300 shadow-none">
                  <Pencil />
                  Edit
                </Button>
              </Link>
              <Button className="w-full bg-red-500 hover:bg-red-500/80 transition-colors py-5 text-base ">
                Delete
              </Button>

            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default JobDetailsEmployer;