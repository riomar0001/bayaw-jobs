import { EducationSample, images } from "@/constants"

const Education = () => {
    return (
        <div className="bg-white border border-neutral-300 w-[750px] h-auto rounded-lg px-12 py-6">
            <h1 className="font-semibold text-xl mb-6">Education</h1>

            {EducationSample.map((sample) => (
                <section key={sample.id}>
                    <div className="flex items-center gap-x-5">
                        <img src={sample.schoolImage} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                            <h1 className="font-semibold text-base">{sample.school} </h1>
                            <h1 className="font-normal text-base">{sample.course} </h1>
                            <h1 className="text-xs text-neutral-500 space-x-3 my-2">
                                <span>{sample.date} </span>
                                <span>•</span>
                                <span>{sample.location} </span>
                            </h1>
                        </div>
                    </div>
                    {sample.id !== EducationSample[EducationSample.length - 1].id && <hr className="border my-6" />}
                </section>
            ))}

        </div>
    )
}

export default Education