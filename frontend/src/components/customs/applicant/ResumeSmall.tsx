import { Button } from "@/components/ui/button"
import { Download, ScrollText } from "lucide-react"

const ResumeSmall = () => {
    return (
        <div className="bg-white border border-neutral-300 w-[380px] h-auto rounded-lg p-6">
            <h1 className="text-lg font-medium mb-3">Resume</h1>

            <section className="flex justify-between items-center">
                <div className="flex items-center gap-x-5">
                    <section className="bg-neutral-100 w-10 h-10 rounded-lg flex justify-center items-center">
                        <ScrollText className="text-neutral-500" size={20} />
                    </section>
                    <h1 className="font-semibold text-base">jerome-bell-resume.pdf</h1>
                </div>

                <div className="space-x-3">
                    <Button className="bg-lochmara-500 text-white hover:bg-lochmara-500/80 w-10 h-10 rounded-full">
                        <Download size={20} />
                    </Button>
                </div>
            </section>
        </div>
    )
}

export default ResumeSmall