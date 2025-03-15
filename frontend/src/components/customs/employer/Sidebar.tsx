import { logos } from "@/constants"
import { BriefcaseBusiness, ListPlus, Users } from "lucide-react"
import { Link } from "react-router-dom"

const Sidebar = () => {
    return (
        <div className="bg-white w-64 h-screen border border-neutral-300 flex flex-col gap-y-5 px-12 py-10">

            <div className="flex items-center gap-x-5 mb-10">
                <img src={logos.brandlogo} className="w-10 h-10" />
                <h1 className="text-2xl font-medium">JobTally</h1>
            </div>

            <Link to={"/employer/dashboard"}>
                <div className="flex items-center space-x-5 hover:underline cursor-pointer">
                    <BriefcaseBusiness size={20} color="gray" />
                    <h1>Jobs</h1>
                </div>
            </Link>

            <Link to={"/employer/add-job"}>
                <div className="flex items-center space-x-5 hover:underline cursor-pointer">
                    <ListPlus size={20} color="gray" />
                    <h1>Add Job</h1>
                </div>
            </Link>

            <div className="flex items-center space-x-5 hover:underline cursor-pointer">
                <Users size={20} color="gray" />
                <h1>Profile</h1>
            </div>

        </div>
    )
}

export default Sidebar