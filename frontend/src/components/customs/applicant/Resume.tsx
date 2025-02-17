import { Button } from "@/components/ui/button"
import { Download, FileUser, ScrollText } from "lucide-react"

const Resume = () => {
    return (
        <div className="bg-white border border-neutral-300 w-[750px] h-auto rounded-lg px-12 py-6">
            <h1 className="font-semibold text-xl mb-6">Resume</h1>
            

            <section className="flex justify-between items-center">
                <div className="flex items-center gap-x-5">
                    <section className="bg-neutral-100 w-10 h-10 rounded-lg flex justify-center items-center">
                        <ScrollText className="text-neutral-500" size={20} />
                    </section>
                    <h1 className="font-semibold text-lg">jerome-bell-resume.pdf</h1>
                </div>

                <div className="space-x-3">
                    <Button className="bg-white text-lochmara-500 border border-lochmara-500 hover:border-lochmara-500/80 hover:text-lochmara-500/80 rounded-full hover:bg-transparent">
                        View
                        <FileUser size={20} />
                    </Button>
                    <Button className="bg-lochmara-500 text-white hover:bg-lochmara-500/80 rounded-full">
                        Download <Download size={20} />
                    </Button>
                </div>
            </section>


        </div>
    )
}

export default Resume