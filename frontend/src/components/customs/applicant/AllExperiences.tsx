import { ExperiencesSample } from "@/constants"
import { PencilLine, CirclePlus } from "lucide-react"
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import axios from "axios";
import UpdateExperience from "./modals/UpdateExperience";
import AddExperience from "./modals/AddExperience";

const AllExperiences = () => {
    const { authStateApplicant } = useAuth();
    const [experiences, setExperiences] = useState([]);
    const applicant_id = authStateApplicant?.user_id;

    useEffect(() => {
        const fetchResume = async () => {
            if (!applicant_id) return;

            try {
                const response = await axios.get(`/api/applicant/experience/${applicant_id}`);
                const data = response.data;

                if (data.success) {
                    setExperiences(data.experiences || "");
                }
            } catch (error: any) {
                console.error(error.message);
            }
        }

        fetchResume();
    }, [applicant_id]);
    return (
        <div className="bg-white border border-neutral-100 w-[750px] h-auto rounded-lg px-12 py-6">
            <section className="flex justify-between items-center mb-6">
                <h1 className="font-semibold text-xl">All Experiences</h1>
                <AddExperience />
            </section>
            {experiences.map((experience: any) => (
                <section key={experience.id}>
                    <div className="flex  justify-between items-center gap-x-5">
                        <div>
                            <h1 className="font-semibold text-base">{experience.company}</h1>
                            <div className="flex items-center gap-x-5">
                                <h1 className="font-normal text-base">{experience.position} </h1>
                                <h1 className="text-xs text-neutral-500 space-x-3">
                                    <span>{experience.worked_years} Years </span>
                                </h1>
                            </div>
                        </div>
                        <UpdateExperience experience={experience} />
                    </div>
                    {experience.id !== ExperiencesSample[ExperiencesSample.length - 1].id && <hr className="border my-3" />}
                </section>
            ))}


        </div>
    )
}

export default AllExperiences