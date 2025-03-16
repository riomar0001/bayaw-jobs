import JobsPickCard from "@/components/customs/landing/cards/JobsPickCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JobsPickItems } from "@/constants";
import { Search } from "lucide-react";

const Hero = () => {
  return (
    <div className="h-min">
      <div className="text-center space-y-6 px-24 pt-20">
        <h1 className="text-7xl font-semibold">Find Jobs</h1>
        <h1 className="text-2xl text-neutral-700 font-light">
          Search and find your dream job is now easier than ever. Just browse a
          job and apply if you need to.
        </h1>
      </div>

      <div className="flex items-center justify-center mt-16 space-x-2">
        <div className="relative flex items-center w-96">
          <Search className="absolute left-3" color="gray" size={20} />
          <Input
            placeholder="Job title, Salary, or Companies"
            className="h-12 w-full pl-10 bg-white"
          />
        </div>

        <Button className="bg-lochmara-500 h-12 w-28">Find Job</Button>
      </div>

      <div className="flex items-center justify-center mt-16 space-x-4"></div>
       <div className="w-full h-auto flex flex-col items-center justify-center px-24 mb-10">
                  <h1 className="text-4xl font-medium text-center mb-8">Jobs picks for you</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-10">
                      {JobsPickItems.map((item) => {
                          return (
                              <JobsPickCard
                                  key={item.id}
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
                          );
                      })}
                  </div>
              </div>
    </div>
  );
};

export default Hero;
