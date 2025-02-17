import { ExperiencesSample } from "@/constants"
import { PencilLine } from "lucide-react"


const AllExperiences = () => {
    return (
        <div className="bg-white border border-neutral-300 w-[750px] h-auto rounded-lg px-12 py-6">
            <section className="flex justify-between items-center mb-6">
                <h1 className="font-semibold text-xl">All Experiences</h1>
                <h1 className="font-semibold text-base text-lochmara-500 flex items-center gap-x-2 hover:underline cursor-pointer">
                    <PencilLine size={15} />Edit
                </h1>
            </section>


            {ExperiencesSample.map((sample) => (
                <section key={sample.id}>
                    <div className="flex items-center gap-x-5">
                        <img src={sample.companyImage} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                            <h1 className="font-semibold text-base">{sample.company}</h1>
                            <div className="flex items-center gap-x-5">
                                <h1 className="font-normal text-base">{sample.role} </h1>
                                <h1 className="text-xs text-neutral-500 space-x-3">
                                    <span>•</span>
                                    <span>{sample.duration} </span>
                                    <span>•</span>
                                    <span>{sample.date} </span>
                                </h1>
                            </div>
                        </div>
                    </div>
                    {sample.id !== ExperiencesSample[ExperiencesSample.length - 1].id && <hr className="border my-6" />}
                </section>
            ))}


        </div>
    )
}

export default AllExperiences