import { Button } from "@/components/ui/button"
import { images } from "@/constants"
import { FaLinkedin } from "react-icons/fa"

const AccountHead = () => {
    return (
        <div className="bg-white border border-neutral-100 w-[750px] h-auto rounded-lg px-12 py-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-x-6">
                    <img src={images.sample_profile_1} className="w-14 h-14 rounded-full object-cover" />
                    <section>
                        <h1 className="font-semibold text-2xl">Jerome Bell <span className="text-base font-normal">(24)</span></h1>
                        <h1 className="font-normal text-neutral-600">Coderspace - Senior Software Developer</h1>
                    </section>
                </div>

                <Button className="bg-transparent text-lochmara-700 border border-lochmara-700 hover:bg-lochmara-700/80 hover:text-white">
                    <FaLinkedin /> LinkedIn Account
                </Button>

                {/* <div className="space-x-3">
                    <Button className="bg-transparent text-lochmara-700 border border-lochmara-700 hover:bg-lochmara-700/80 hover:text-white">
                        <FaLinkedin />
                    </Button>
                    <Button className="bg-transparent text-lochmara-700 border border-lochmara-700 hover:bg-lochmara-700/80 hover:text-white">
                        <FaFacebook />
                    </Button>
                    <Button className="bg-transparent text-lochmara-700 border border-lochmara-700 hover:bg-lochmara-700/80 hover:text-white">
                        <FaTwitter />
                    </Button>
                </div> */}
            </div>
        </div>
    )
}

export default AccountHead