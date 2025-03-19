import { BriefcaseBusiness, Cake, MailSearch, MapPinHouse, PencilLine, Smartphone } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios";


const AllPersonalInfo = () => {
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
            <section className="flex justify-between items-center mb-6">
                <h1 className="font-semibold text-xl">All Personal Informations</h1>
                <h1 className="font-semibold text-base text-lochmara-500 flex items-center gap-x-2 hover:underline cursor-pointer">
                    <PencilLine size={15} />Edit
                </h1>
            </section>

            <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-x-5">
                    <section className="bg-neutral-100 w-10 h-10 rounded-lg flex justify-center items-center">
                        <MailSearch className="text-neutral-500" size={20} />
                    </section>
                    <section>
                        <h1 className="font-medium text-black text-base">{personalInfo.email}</h1>
                        <h1 className="font-normal text-neutral-500 text-sm">Mail Address</h1>
                    </section>
                </div>


                <div className="flex items-center gap-x-5">
                    <section className="bg-neutral-100 w-10 h-10 rounded-lg flex justify-center items-center">
                        <Smartphone className="text-neutral-500" size={20} />
                    </section>
                    <section>
                        <h1 className="font-medium text-black text-base">{personalInfo.contact_no}</h1>
                        <h1 className="font-normal text-neutral-500 text-sm">Philippine Number</h1>
                    </section>
                </div>


                <div className="flex items-center gap-x-5">
                    <section className="bg-neutral-100 w-10 h-10 rounded-lg flex justify-center items-center">
                        <Cake className="text-neutral-500" size={20} />
                    </section>
                    <section>
                        <h1 className="font-medium text-black text-base">{personalInfo.date_of_birth}</h1>
                        <h1 className="font-normal text-neutral-500 text-sm">24 Years Old</h1>
                    </section>
                </div>
            </div>

            <hr className="border my-10" />

            <div className="space-y-6">
                <div className="flex items-center gap-x-5">
                    <section className="bg-neutral-100 w-10 h-10 rounded-lg flex justify-center items-center">
                        <MapPinHouse className="text-neutral-500" size={20} />
                    </section>
                    <section>
                        <h1 className="font-medium text-black text-base">{personalInfo.address}</h1>
                        <h1 className="font-normal text-neutral-500 text-sm">Location</h1>
                    </section>

                </div>

                <div className="flex items-center gap-x-5">
                    <section className="bg-neutral-100 w-10 h-10 rounded-lg flex justify-center items-center">
                        <BriefcaseBusiness className="text-neutral-500" size={20} />
                    </section>
                    <section>
                        <h1 className="font-medium text-black text-base">
                            {personalInfo.work_type ? personalInfo.work_type.join(", ") : "No Work Type"}
                        </h1>
                        <h1 className="font-normal text-neutral-500 text-sm">Work Type</h1>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default AllPersonalInfo