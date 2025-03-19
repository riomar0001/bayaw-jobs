import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Banknote, BriefcaseBusiness, MapPin, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import axios from "axios"


const JobCard = ({ data }: any) => {
    const handDelete = async () => {
        try {
            // Delete job
            await axios.delete(`/api/jobs/${data.id}`)
            toast.success("Job deleted successfully")
            window.location.reload()
        } catch (error) {
            toast.error("Failed to delete job")
        }
    }


    return (
        <div className="bg-white border border-neutral-300 rounded-lg w-full min-h-[250px] p-5">
            <h1 className="text-2xl font-bold">{data.title} </h1>
            <p className="text-base font-light text-gray-800 text-wrap">
                {data.description.substring(0, 100)}...
            </p>

            <div className="mt-6 font-thin text-sm">
                <div className="flex items-center gap-x-3">
                    <MapPin size={15} />
                    <h1>{data.location} </h1>
                </div>

                <div className="flex items-center gap-x-3">
                    <BriefcaseBusiness size={15} />
                    <h1>{data.category} </h1>
                </div>

                <div className="flex items-center gap-x-3">
                    <Banknote size={15} />
                    <h1>{data.salary_from} - {data.salary_to}</h1>
                </div>
            </div>


            <div className="mt-6 flex gap-x-3">
                <div className="bg-neutral-200 rounded-sm p-1 px-2 w-fit text-sm">
                    <h1>{data.work_schedule} </h1>
                </div>

                <div className="bg-neutral-200 rounded-sm p-1 px-2 w-fit text-sm">
                    <h1>{new Date(data.created_at).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</h1>

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
                                    <Button variant={"destructive"} onClick={handDelete} >Remove</Button>
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

                <Link to={`/employer/jobs/job-details/${data.id}`} >
                    <Button>View Job</Button>
                </Link>
            </div>

        </div>
    )
}

export default JobCard