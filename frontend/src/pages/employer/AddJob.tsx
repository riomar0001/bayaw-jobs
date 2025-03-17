import AddJobCard from "@/components/customs/employer/cards/AddJobCard"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

const AddJob = () => {
    return (
        <div className="px-24 py-12">
            <Link to={"/employer/jobs"}>
                <Button className="mb-3">
                    <ArrowLeft size={15} />
                    Go Back
                </Button>
            </Link>

            <div className="flex gap-x-5">
                <AddJobCard />

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