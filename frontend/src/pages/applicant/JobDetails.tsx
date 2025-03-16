import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { images } from "@/constants";
import { ArrowLeft, MapPin, Calendar, Briefcase, DollarSign, Clock, Building } from "lucide-react";
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
        <section className="flex-1">
          <Card className="border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-neutral-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={images.sample_company_1}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover border border-neutral-200 shadow-sm"
                    alt="Company logo"
                  />
                  <Badge className="absolute -top-2 -right-2 bg-green-500 hover:bg-green-600">Active</Badge>
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800">Standing Position</h1>
                  <div className="flex items-center gap-2 text-neutral-500">
                    <Building size={16} className="text-lochmara-400" />
                    <span className="font-medium">Bayaw</span>
                    <span className="text-xs text-neutral-400">• Posted yesterday</span>
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
                    <h2 className="font-semibold text-gray-700">Job Category</h2>
                    <p className="text-neutral-600">On Site</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-lochmara-50 p-2 rounded-lg">
                    <MapPin size={18} className="text-lochmara-500" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-700">Location</h2>
                    <p className="text-neutral-600">Calinan</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-lochmara-50 p-2 rounded-lg">
                    <DollarSign size={18} className="text-lochmara-500" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-700">Salary Range</h2>
                    <p className="text-neutral-600">1 Slp</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-lochmara-50 p-2 rounded-lg">
                    <Clock size={18} className="text-lochmara-500" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-700">Work Schedule</h2>
                    <p className="text-neutral-600">Full Time</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 border-b border-neutral-100 pb-2">Job Description</h2>
                  <p className="text-neutral-600">Standing Position</p>
                </div>

                <div className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={18} className="text-lochmara-500" />
                    <h2 className="text-md font-semibold text-gray-700">Application Timeline</h2>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-neutral-500 text-sm">Posted</p>
                        <p className="font-medium">Yesterday</p>
                      </div>
                      <div className="h-0.5 w-16 bg-neutral-200 hidden md:block"></div>
                      <div>
                        <p className="text-neutral-500 text-sm">Status</p>
                        <p className="font-medium text-green-600">Open for Applications</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

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