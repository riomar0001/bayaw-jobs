import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

const AddJob = () => {
    return (
        <div className="p-12">
            <Link to={"/employer/dashboard"}>
                <Button className="mb-3">
                    <ArrowLeft size={15} />
                    Go Back
                </Button>
            </Link>

            <div className="flex gap-x-5">
                <section className="flex-1">
                    <div className="bg-white border border-neutral-300 rounded-lg w-full px-12 py-10">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold">Post New Job</h1>
                            <h1 className="text-base font-normal text-neutral-500">Fill in the form below to post a new job</h1>
                        </div>

                        <div className="mt-4">
                            <h1 className="font-semibold">Position</h1>
                            <Input className="shadow-none h-10 bg-neutral-100/50" />
                        </div>

                        <div className="mt-4">
                            <h1 className="font-semibold">Job Description</h1>
                            <Textarea className="shadow-none h-24 bg-neutral-100/50" />
                        </div>

                        <div className="mt-4">
                            <h1 className="font-semibold">Job Address</h1>
                            <Input className="shadow-none h-10 bg-neutral-100/50" />
                        </div>

                        <div className="mt-4">
                            <h1 className="font-semibold">Job Category</h1>
                            <Select>
                                <SelectTrigger className="shadow-none w-1/3 h-10 bg-neutral-100/50">
                                    <SelectValue placeholder="Select Job Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Part-Time</SelectItem>
                                    <SelectItem value="dark">Full-Time</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mt-4">
                            <h1 className="font-semibold">Salary Range</h1>
                            <div className="flex gap-x-5">
                                <Input className="shadow-none h-10 bg-neutral-100/50" placeholder="Min Salary" />
                                <Input className="shadow-none h-10 bg-neutral-100/50" placeholder="Max Salary" />
                            </div>
                        </div>

                        <div className="mt-4">
                            <h1 className="font-semibold">Work Schedule</h1>
                            <Select>
                                <SelectTrigger className="shadow-none w-1/3 h-10 bg-neutral-100/50">
                                    <SelectValue placeholder="Select Job Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Remote</SelectItem>
                                    <SelectItem value="dark">On-Site</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="bg-white border border-neutral-300 rounded-lg p-6">
                        <h1 className="font-semibold">Actions</h1>
                        <h1 className="font-light text-neutral-500">Perform actions on the Job below.</h1>
                        <hr className="my-5" />
                        <Button className="w-full">Save</Button>
                    </div>
                </section>

            </div>

        </div>
    )
}

export default AddJob