import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Banknote, BriefcaseBusiness, MapPin, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"


const JobCard = ({ position, description, address, category, minSalary, maxSalary, schedule, date }: JobCardProps) => {
    return (
        <div className="bg-white border border-neutral-300 rounded-lg w-full min-h-[250px] p-5">
            <h1 className="text-2xl font-bold">{position} </h1>
            <h1 className="text-base font-light text-gray-800">{description} </h1>

            <div className="mt-6 font-thin text-sm">
                <div className="flex items-center gap-x-3">
                    <MapPin size={15} />
                    <h1>{address} </h1>
                </div>

                <div className="flex items-center gap-x-3">
                    <BriefcaseBusiness size={15} />
                    <h1>{category} </h1>
                </div>

                <div className="flex items-center gap-x-3">
                    <Banknote size={15} />
                    <h1>{minSalary} - {maxSalary}</h1>
                </div>
            </div>


            <div className="mt-6 flex gap-x-3">
                <div className="bg-neutral-200 rounded-sm p-1 px-2 w-fit text-sm">
                    <h1>{schedule} </h1>
                </div>

                <div className="bg-neutral-200 rounded-sm p-1 px-2 w-fit text-sm">
                    <h1>{date} </h1>
                </div>
            </div>


            <div className="mt-6 flex items-center justify-between">
                {/* <Button variant={"destructive"}>Delete</Button> */}
                {/* <h1 className="text-red-500 underline cursor-pointer text-sm">Delete</h1> */}


                <Dialog>
                    <DialogTrigger>
                        <Trash2 className="text-red-400 cursor-pointer font-thin" size={20} />
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                            <DialogDescription className="space-y-3">
                                <h1>Deleting this job will permanently be removed.</h1>
                                <div className="flex justify-end">
                                    <Button variant={"destructive"}>Remove</Button>
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

                <Link to={"/employer/jobs/edit-job"}>

                    <Link to={"/employer/jobs/job-details"} >
                        <Button>View Job</Button>
                    </Link>
                </Link>
            </div>

        </div>
    )
}

export default JobCard