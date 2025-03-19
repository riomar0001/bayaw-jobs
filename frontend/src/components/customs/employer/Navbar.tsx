import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DoorOpen } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/authContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const { onLogoutCompany } = useAuth();

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            onLogoutCompany?.();
            navigate("/employer");
        } catch (error: any) {
            console.error(error);
        }
    };
    return (
        <div className="bg-white w-full h-[75px] border-b-2 border-neutral-300 flex items-center justify-end px-16">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <DoorOpen size={15} color="gray" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>


        </div>
    )
}

export default Navbar