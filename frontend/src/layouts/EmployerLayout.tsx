import Navbar from "@/components/customs/employer/Navbar"
import Sidebar from "@/components/customs/employer/Sidebar"
import { Outlet } from "react-router-dom"

const EmployerLayout = () => {
    return (
        <div className="flex">
            <Sidebar />

            <div className="w-screen bg-neutral-100">
                <Navbar />
                <Outlet />
            </div>
        </div>
    )
}

export default EmployerLayout