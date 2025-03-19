import { Button } from "@/components/ui/button"
import { Download, FileUser, ScrollText } from "lucide-react"
import { PencilLine } from "lucide-react"
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/authContext";
import ViewApplicantResume from "./modals/ViewApplicantResume";
import UpdateResume from "./modals/UpdateResume";


const Resume = ({ data }: any) => {
    const { authStateApplicant } = useAuth();
    const [resumeFileName, setResumeFileName] = useState("");
    const [resumeFile, setResumeFile] = useState("");
    const applicant_id = authStateApplicant?.user_id;

    const handleDownload = async () => {
        try {
            const response = await axios.get(`/api/applicant/resume/download/${applicant_id}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'resume.pdf';
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?([^"]+)"?/);
                if (match?.[1]) filename = match[1];
            }
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error: any) {
            console.error('Error downloading file:', error.message);
        }
    };


    useEffect(() => {
        const fetchResume = async () => {
            if (!applicant_id) return;

            try {
                const response = await axios.get(`/api/applicant/resume/${applicant_id}`);
                const data = response.data;

                if (data.success) {
                    setResumeFileName(data.resume_file_name || "");
                    setResumeFile(data.resume_file || "");
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
                <h1 className="font-semibold text-xl">Resume</h1>
                {/* <h1 className="font-semibold text-base text-lochmara-500 flex items-center gap-x-2 hover:underline cursor-pointer">
                    <PencilLine size={15} />Edit
                </h1> */}
                <UpdateResume />
            </section>


            <section className="flex justify-between items-center">
                <div className="flex items-center gap-x-5">
                    <section className="bg-neutral-100 w-10 h-10 rounded-lg flex justify-center items-center">
                        <ScrollText className="text-neutral-500" size={20} />
                    </section>
                    <h1 className="font-semibold text-lg">{resumeFileName.substring(0, 30) + "..." || "No File Update"}</h1>
                </div>

                <div className="space-x-3">
                    {/* <Button className="bg-white text-lochmara-500 border border-lochmara-500 hover:border-lochmara-500/80 hover:text-lochmara-500/80 rounded-full hover:bg-transparent">
                        View
                        <FileUser size={20} />
                    </Button> */}
                    <ViewApplicantResume cv_file={resumeFile} />
                    <Button onClick={handleDownload} className="bg-lochmara-500 text-white hover:bg-lochmara-500/80 rounded-full">
                        Download <Download size={20} />
                    </Button>
                </div>
            </section>


        </div>
    )
}

export default Resume