import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DoorOpen } from "lucide-react"
import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <div className="bg-white w-full h-[75px] border-b-2 border-neutral-300 flex items-center justify-end px-12">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <DoorOpen size={15} color="gray" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <Link to={"/login"}>
                        <DropdownMenuItem>Logout</DropdownMenuItem>
                    </Link>
                </DropdownMenuContent>
            </DropdownMenu>


        </div>
    )
}

export default Navbar