import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const OnboardingCompany = () => {
  return (
    <div className="px-36 py-12">
      <div className="flex gap-x-5 flex-col">
        <section className="flex-1">
          <div className="bg-white border border-neutral-300 rounded-lg w-full px-12 py-10">
            <div className="mb-8">
              <h1 className="text-2xl font-bold">Company Form</h1>
            </div>

            <div className="mt-4">
              <h1 className="font-semibold">Name</h1>
              <Input className="shadow-none h-10 bg-neutral-100/50" />
            </div>

            <div className="mt-4">
              <h1 className="font-semibold">Address</h1>
              <Input className="shadow-none h-10 bg-neutral-100/50" />
            </div>

            <div className="mt-4">
              <h1 className="font-semibold">Description</h1>
              <Textarea className="shadow-none h-10 bg-neutral-100/50" />
            </div>

            <div className="mt-4">
              <h1 className="font-semibold">Contact Number</h1>
              <Input className="shadow-none h-10 bg-neutral-100/50" />
            </div>

            <div className="mt-4">
              <h1 className="font-semibold">Type of Industry</h1>
              <Input className="shadow-none h-10 bg-neutral-100/50" />
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

export default OnboardingCompany;
