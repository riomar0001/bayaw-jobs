import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApplicantRegistrationForm from "@/components/customs/applicant/auth/RegistrationForm";
import EmployerRegistrationForm from "@/components/customs/employer/auth/RegistrationForm";

const AccountRegistration = () => {

  return (
    <div className="bg-neutral-100 w-full h-auto py-24">
      <h1 className="text-4xl font-medium text-center mb-8">Account Registration</h1>

      <div className="flex justify-center">
        <Tabs defaultValue="jobseeker">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="jobseeker" className="data-[state=active]:text-white data-[state=active]:bg-lochmara-500 text-base font-normal">Job Seekers</TabsTrigger>
              <TabsTrigger value="employer" className="data-[state=active]:text-white data-[state=active]:bg-lochmara-500 text-base font-normal">Employers</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="jobseeker">
            <ApplicantRegistrationForm />
          </TabsContent>

          <TabsContent value="employer">
            <EmployerRegistrationForm />
          </TabsContent>
        </Tabs>
      </div>



    </div>
  );
};

export default AccountRegistration;