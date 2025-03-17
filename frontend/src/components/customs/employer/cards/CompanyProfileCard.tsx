import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const CompanyProfileCard = ({ companyIndustry, companyName, companyDescription, companyAddress, companyImage, email, contactNumber }: CompanyProfileProps) => {
    return (
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
                        <h1 className="font-semibold">{companyIndustry} </h1>
                    </div>

                    <Dialog>
                        <DialogTrigger>
                            <h1 className="text-gray-500 text-sm hover:underline cursor-pointer">Update Industry</h1>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Update Industry</DialogTitle>
                                <DialogDescription>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an Industry" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="tech">Tech Industry</SelectItem>
                                            <SelectItem value="healthcare">Healthcare</SelectItem>
                                            <SelectItem value="finance">Finance</SelectItem>
                                            <SelectItem value="education">Education</SelectItem>
                                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                        </SelectContent>
                                    </Select>

                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>

                </div>

                <hr className="my-4" />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-4">
                        <img src={companyImage} className="w-12 h-12 rounded-full object-cover border border-neutral-300" />
                        <div>
                            <h1 className="font-light text-gray-500">Company Name</h1>
                            <h1 className="font-semibold text-lg">{companyName} </h1>
                        </div>
                    </div>
                    <Dialog>
                        <DialogTrigger>
                            <h1 className="text-gray-500 text-sm hover:underline cursor-pointer">Update Company</h1>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Update Company</DialogTitle>
                                <DialogDescription className="space-y-2">
                                    <Input placeholder="Enter company name" />
                                    <Textarea placeholder="Enter description of your company" />
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="mt-3">
                    <h1 className="font-light text-gray-500">Company Description</h1>
                    <h1 className="font-light">{companyDescription} </h1>
                </div>

                <hr className="my-4" />

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-light text-gray-500">Company Address</h1>
                        <h1 className="font-semibold">{companyAddress} </h1>
                    </div>

                    <Dialog>
                        <DialogTrigger>
                            <h1 className="text-gray-500 text-sm hover:underline cursor-pointer">Update Address</h1>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Update Address of the Company</DialogTitle>
                                <DialogDescription className="space-y-2">
                                    <Textarea placeholder="Enter company address" />
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>


                </div>

                <hr className="my-4" />

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-light text-gray-500">Email Address</h1>
                        <h1 className="font-semibold mb-2">{email} </h1>
                        <h1 className="font-light text-gray-500">Contact Number</h1>
                        <h1 className="font-semibold">{contactNumber} </h1>
                    </div>
                    <Dialog>
                        <DialogTrigger>
                            <h1 className="text-gray-500 text-sm hover:underline cursor-pointer">Update Contact Info</h1>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Update Contact Information</DialogTitle>
                                <DialogDescription className="space-y-2">
                                    <Input placeholder="Enter new contact number" />
                                    <Input placeholder="Enter new email" />
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>

            </div>



        </section>
    )
}

export default CompanyProfileCard