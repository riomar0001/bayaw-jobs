import JobDetailsCard from "@/components/customs/applicant/cards/JobDetailsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { images } from "@/constants";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const JobDetails = () => {
  return (
    <div className="bg-gradient-to-b from-sky-50 to-neutral-100 min-h-screen px-6 py-8 md:px-12 lg:px-24 xl:px-36">
      <Link to={"/find-jobs/"} className="inline-block mb-6">
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
              <p className="text-sm text-neutral-500">Apply for this position</p>
            </CardHeader>
            <CardContent className="pt-6">
              <Button className="w-full bg-lochmara-500 hover:bg-lochmara-600 transition-colors py-6 text-base font-medium">
                Apply Now
              </Button>

              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <span className="font-medium">Note:</span> Make sure your profile is up to date before applying.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-center">
                <Button variant="ghost" className="text-neutral-500 hover:text-lochmara-500 text-sm">
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