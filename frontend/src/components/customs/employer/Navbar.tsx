import { DoorOpen } from "lucide-react"

const Navbar = () => {
    return (
        <div className="bg-white w-full h-[75px] border-b-2 border-neutral-300 flex items-center justify-end px-12">
            
            <div className="">
                <DoorOpen size={15} color="gray"/>
            </div>

        </div>
    )
}

export default Navbar