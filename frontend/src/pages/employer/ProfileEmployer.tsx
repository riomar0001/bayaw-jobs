import { Button } from "@/components/ui/button"
import { images } from "@/constants"
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
                <section className="flex-1">
                    <div className="bg-white border border-neutral-300 rounded-lg w-full px-12 py-10">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold">Company Profile</h1>
                            <h1 className="text-base font-normal text-neutral-500">View the company profile below</h1>
                        </div>

                        <hr className="my-4" />

                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="font-light text-gray-500">Company Industry</h1>
                                <h1 className="font-semibold">Tech Industry</h1>
                            </div>
                            <h1 className="text-gray-500 text-sm hover:underline cursor-pointer">Update Industry</h1>
                        </div>

                        <hr className="my-4" />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-x-4">
                                <img src={images.sample_company_1} className="w-12 h-12 rounded-full object-cover border border-neutral-300" />
                                <div>
                                    <h1 className="font-light text-gray-500">Company Name</h1>
                                    <h1 className="font-semibold text-lg">KONAMI</h1>
                                </div>
                            </div>
                            <h1 className="text-gray-500 text-sm hover:underline cursor-pointer">Update Company</h1>
                        </div>

                        <div className="mt-3">
                            <h1 className="font-light text-gray-500">Company Description</h1>
                            <h1 className="font-light">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia cum repellat distinctio recusandae dignissimos aspernatur velit, cumque error. Ratione quasi sit maxime reiciendis perferendis vero perspiciatis est iusto facilis modi.</h1>
                        </div>

                        <hr className="my-4" />

                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="font-light text-gray-500">Company Address</h1>
                                <h1 className="font-semibold">03 Red Stone, Calinan, Davao City</h1>
                            </div>
                            <h1 className="text-gray-500 text-sm hover:underline cursor-pointer">Update Address</h1>
                        </div>

                        <hr className="my-4" />

                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="font-light text-gray-500">Email Address</h1>
                                <h1 className="font-semibold mb-2">konami@gmail.com</h1>
                                <h1 className="font-light text-gray-500">Contact Number</h1>
                                <h1 className="font-semibold">09987654321</h1>
                            </div>
                            <h1 className="text-gray-500 text-sm hover:underline cursor-pointer">Update Contact Info</h1>
                        </div>

                    </div>



                </section>

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