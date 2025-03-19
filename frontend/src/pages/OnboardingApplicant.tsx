import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OnboardingApplicant = () => {
  return (
    <div className="px-36 py-12">
      <div className="flex gap-x-5 flex-col">
        <section className="flex-1">
          <div className="bg-white border border-neutral-300 rounded-lg w-full px-12 py-10">
            <div className="mb-8">
              <h1 className="text-2xl font-bold">Applicant Form</h1>
            </div>

            <div className="mt-4">
              <h1 className="font-semibold">Contact Number</h1>
              <Input className="shadow-none h-10 bg-neutral-100/50" />
            </div>

            <div className="mt-4">
              <h1 className="font-semibold">Email</h1>
              <Input className="shadow-none h-10 bg-neutral-100/50" />
            </div>

            <div className="mt-4">
              <h1 className="font-semibold">Address</h1>
              <Input className="shadow-none h-10 bg-neutral-100/50" />
            </div>

            <div className="mt-4">
              <h1 className="font-semibold">Professional Title</h1>
              <Input className="shadow-none h-10 bg-neutral-100/50" />
            </div>

            <div className="mt-4">
              <h1 className="font-semibold">Work Type</h1>
              <Select>
                <SelectTrigger className="shadow-none w-1/3 h-10 bg-neutral-100/50">
                  <SelectValue placeholder="Select Job Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Full Time</SelectItem>
                  <SelectItem value="dark">Part Time</SelectItem>
                  <SelectItem value="light">Contractual</SelectItem>
                  <SelectItem value="dark">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4">
              <h1 className="font-semibold">Resume</h1>
              <Button 
                variant="outline" 
                className="h-10 bg-neutral-100/50 border-neutral-300"
              >
                Upload Resume
              </Button>
            </div>
          </div>
        </section>

        <div className="flex justify-end mt-5">
          <Button className="mb-3">Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingApplicant;