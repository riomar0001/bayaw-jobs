import CompanyProfileCard from "@/components/customs/employer/cards/CompanyProfileCard"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { CompanyProfileSample } from "@/constants"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

const ProfileEmployer = () => {

    return (
        <div className="px-24 py-12">
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

                        <Dialog>
                            <DialogTrigger className="w-full">
                                <Button className="w-full mb-2">Update Account Email</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Update Account Email</DialogTitle>
                                    <DialogDescription className="space-y-4">
                                        <div>
                                            <h1 className="text-gray-500 font-light">Current Account Email</h1>
                                            <h1 className="text-lochmara-400 font-medium">user@gmail.com</h1>
                                        </div>
                                        <div>
                                            <h1 className="text-gray-500 font-light">New Email Address</h1>
                                            <Input placeholder="Enter new email" />
                                        </div>
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>



                        <Dialog>
                            <DialogTrigger className="w-full">
                                <Button className="w-full mb-2">Update Password</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Update Password</DialogTitle>
                                    <DialogDescription className="space-y-3">
                                        <Input placeholder="Current Password" />
                                        <Input placeholder="New Password" />
                                        <Input placeholder="Confirm New Password" />
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>

                        <hr className="my-8" />

                        <Dialog>
                            <DialogTrigger className="w-full">
                                <Button className="w-full" variant={"destructive"}>Delete Company</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you sure?</DialogTitle>
                                    <DialogDescription className="space-y-3">
                                        <h1>Deleting this company will permanently be removed, and you cannot undo the changes</h1>
                                        <div className="flex justify-end">
                                            <Button variant={"destructive"}>Remove</Button>
                                        </div>
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>

                    </div>
                </section>

            </div>

        </div>
    )
}

export default ProfileEmployer