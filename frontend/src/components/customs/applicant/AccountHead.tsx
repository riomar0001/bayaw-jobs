import { Button } from "@/components/ui/button"
import { images } from "@/constants"
import { FaLinkedin } from "react-icons/fa"
import { useState, useEffect } from "react";
import axios from "axios";


interface AccountHeadProps {
    linkedInURL?: string;
}

const AccountHead = ({ linkedInURL }: AccountHeadProps) => {
    const [personalInfo, setPersonalInfo] = useState<any>({});


    useEffect(() => {
        const fetchPersonalInfo = async () => {
            try {
                const response = await axios.get("/api/applicant");
                const data = response.data;
                setPersonalInfo(data.accountPersonalInfo);
            } catch (error) {
                console.error(error);
            }
        }
        fetchPersonalInfo();
    }, []);

    return (
        <div className="bg-white border border-neutral-100 w-[750px] h-auto rounded-lg px-12 py-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-x-6">
                    <img src={images.sample_profile_1} className="w-14 h-14 rounded-full object-cover" />
                    <section>
                        <h1 className="font-semibold text-2xl">{personalInfo.first_name} {personalInfo.last_name}</h1>
                        <h1 className="font-normal text-neutral-600">{personalInfo.professional_title}</h1>
                    </section>
                </div>

                <a
                    href={linkedInURL ? (linkedInURL.startsWith('http') ? linkedInURL : `https://${linkedInURL}`) : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button className="bg-transparent text-lochmara-700 border border-lochmara-700 hover:bg-lochmara-700/80 hover:text-white">
                        <FaLinkedin /> LinkedIn Account
                    </Button>
                </a>
            </div>
        </div>
    )
}


export default AccountHead