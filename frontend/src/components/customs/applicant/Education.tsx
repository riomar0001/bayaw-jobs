import { EducationSample } from "@/constants"
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import axios from "axios";

const Education = () => {
    const { authStateApplicant } = useAuth();
    const [education, setEducation] = useState([]);
    const applicant_id = authStateApplicant?.user_id;

    console.log(education);


    useEffect(() => {
        const fetchResume = async () => {
            if (!applicant_id) return;

            try {
                const response = await axios.get(`/api/applicant/education/${applicant_id}`);
                const data = response.data;

                if (data.success) {
                    setEducation(data.data || "");
                }
            } catch (error: any) {
                console.error(error.message);
            }
        }

        fetchResume();
    }, [applicant_id]);
    return (
        <div className="bg-white border border-neutral-100 w-[750px] h-auto rounded-lg px-12 py-6">
            <h1 className="font-semibold text-xl mb-6">Education</h1>

            {education.map((education: any) => (
                <section key={education.id}>
                    <div className="flex items-center gap-x-5">
                        <div>
                            <h1 className="font-semibold text-base">{education.school_name} </h1>
                            <h1 className="font-normal text-base">{education.degree} </h1>
                            <h1 className="text-xs text-neutral-500 space-x-3 my-2">
                                <span>{education.start_date} - {education.end_date}</span>
                                {/* <span>•</span>
                                <span>{sample.location} </span> */}
                            </h1>
                        </div>
                    </div>
                    {education.id !== EducationSample[EducationSample.length - 1].id && <hr className="border my-6" />}
                </section>
            ))}

        </div>
    )
}

export default Education