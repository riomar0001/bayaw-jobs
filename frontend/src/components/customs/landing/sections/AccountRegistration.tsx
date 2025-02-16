import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobSeekerRegister from "../cards/JobSeekerRegister";
import EmployerRegister from "../cards/EmployerRegister";

const AccountRegistration = () => {
  

  return (
    <div className="bg-white w-full h-auto pt-12 pb-24">
      <h1 className="text-4xl font-medium text-center mb-8">Account Registration</h1>

      <div className="flex justify-center">
        <Tabs defaultValue="jobseeker">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="jobseeker" className="data-[state=active]:text-white data-[state=active]:bg-[#1783D0] text-base font-normal">Job Seekers</TabsTrigger>
              <TabsTrigger value="employer" className="data-[state=active]:text-white data-[state=active]:bg-[#1783D0] text-base font-normal">Employers</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="jobseeker">
            <JobSeekerRegister />
          </TabsContent>

          <TabsContent value="employer">
            <EmployerRegister/>
          </TabsContent>
        </Tabs>
      </div>



    </div>
  );
};

export default AccountRegistration;