import CompanyProfileCard from "@/components/customs/employer/cards/CompanyProfileCard"
import { Button } from "@/components/ui/button"
import { CompanyProfileSample } from "@/constants"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

const ProfileEmployer = () => {
    return (
        <div className="p-12">
            <Link to={"/employer/jobs"}>
                <Button className="mb-3">
                    <ArrowLeft size={15} />
                    Go Back
                </Button>
            </Link>

            <div className="flex gap-x-5">

                {CompanyProfileSample.map((item, index) => (
                    <CompanyProfileCard
                        key={index}
                        companyIndustry={item.companyIndustry}
                        companyName={item.companyName}
                        companyDescription={item.companyDescription}
                        companyImage={item.companyImage}
                        companyAddress={item.companyAddress} 
                        email={item.email}
                        contactNumber={item.contactNumber}
                    />
                ))}


                <section>
                    <div className="bg-white border border-neutral-300 rounded-lg p-6">
                        <h1 className="font-semibold">Actions</h1>
                        <h1 className="font-light text-neutral-500">Perform actions on the member below.</h1>
                        <hr className="my-5" />
                        <Button className="w-full mb-2">Update Account Email</Button>
                        <Button className="w-full">Update Password</Button>
                        <hr className="my-8" />
                        <Button className="w-full" variant={"destructive"}>Delete Company</Button>
                    </div>
                </section>

            </div>

        </div>
    )
}

export default ProfileEmployer