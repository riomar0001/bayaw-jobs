import { Button } from "@/components/ui/button"
import { Banknote, BriefcaseBusiness, MapPin } from "lucide-react"


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


            <div className="mt-6 flex justify-between">
                <Button variant={"destructive"}>Delete</Button>
                <Button>View Job</Button>
            </div>

        </div>
    )
}

export default JobCard