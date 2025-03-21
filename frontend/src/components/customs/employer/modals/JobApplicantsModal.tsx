import ApplicantsCard from "../cards/ApplicantsCard";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useEffect } from "react";
import Spinner from "../Spinner";

interface JobData {
    id: string;
    company_account_id: string;
    title: string;
    description: string;
    location: string;
    category: string;
    salary_from: number;
    salary_to: number;
    work_schedule: string;
    years_exp: number;
    is_closed: boolean;
    created_at: string;
    updated_at: string;
}

interface JobId {
    job_id: string
}

interface WorkExperience {
    id: string;
    company: string;
    address: string;
    position: string;
    worked_years: string;
}

interface ApplicantInfo {
    basic_info: {
        id: string;
        applicants_account_id: string;
        first_name: string;
        last_name: string;
        email: string;
        contact_no: string;
        created_at: string;
    };
    work_experience: WorkExperience[];
    resume: {
        id: string;
        resume_file: string;
        resume_link: string;
    };
    application_status: string;
}

interface ApplicantResponse {
    success: boolean;
    message: string;
    applicantMap: Record<string, ApplicantInfo>;
}

const JobApplicantsModal = ({ job_id }: JobId) => {
    console.log(job_id);
    

    const [applicants, setApplicants] = useState<Record<string, ApplicantInfo>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedApplicant, setSelectedApplicant] = useState<ApplicantInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchApplicants();
    }, [job_id]);

    const fetchApplicants = async () => {
        try {
            setLoading(true);
            const response = await axios.get<ApplicantResponse>(`/api/jobs/applicants/${job_id}`);
            setApplicants(response.data.applicantMap);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch applicants");
            console.error("Error fetching applicants:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewResume = (resumeLink: string) => {
        window.open(resumeLink, "_blank");
    };

    const handleHireApplicant = async (applicantId: string) => {
        if (!selectedApplicant) return;
        
        try {
            setActionLoading(true);
            await axios.put(`/api/jobs/applicant/hire/${job_id}/applicant/${applicantId}`);
            alert("Applicant has been hired successfully!");
            fetchApplicants(); // Refresh the data
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to hire applicant");
            console.error("Error hiring applicant:", err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectApplicant = async (applicantId: string) => {
        if (!selectedApplicant) return;
        
        try {
            setActionLoading(true);
            await axios.put(`/api/jobs/applicant/reject/${job_id}/applicant/${applicantId}`);
            alert("Applicant has been rejected");
            fetchApplicants(); // Refresh the data
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to reject applicant");
            console.error("Error rejecting applicant:", err);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Job Applicants</h2>
            {Object.keys(applicants).length === 0 ? (
                <p>No applicants for this job yet.</p>
            ) : (
                <div className="space-y-4">
                    {Object.entries(applicants).map(([id, applicant]) => (
                        <Dialog key={id} onOpenChange={(open) => {
                            if (open) setSelectedApplicant(applicant);
                            else setSelectedApplicant(null);
                        }}>
                            <DialogTrigger className="w-full">
                                <ApplicantsCard
                                    name={`${applicant.basic_info.first_name} ${applicant.basic_info.last_name}`}
                                    email={applicant.basic_info.email}
                                    contactNumber={applicant.basic_info.contact_no}
                                    applicantId={applicant.basic_info.id}
                                    applicationStatus={applicant.application_status}
                                />
                            </DialogTrigger>
                            <DialogContent className="max-h-[720px] w-full overflow-scroll">
                                <DialogHeader>
                                    <DialogTitle>
                                        <h1 className="text-2xl font-semibold">
                                            Applicant Details
                                        </h1>
                                        <h1 className="text-gray-500 font-light text-base">
                                            Review the applicant's information and access
                                            their CV
                                        </h1>
                                    </DialogTitle>
                                    <DialogDescription>
                                        <div className="">
                                            {/* Application Status Badge */}
                                            <div className="mb-4">
                                                <h1 className="text-black text-lg">
                                                    Application Status
                                                </h1>
                                                <hr />
                                                <div className="mt-2">
                                                    <span className={`px-3 py-1 rounded-full text-white ${
                                                        applicant.application_status === 'hired' ? 'bg-green-500' : 
                                                        applicant.application_status === 'rejected' ? 'bg-red-500' : 
                                                        'bg-yellow-500'
                                                    }`}>
                                                        {applicant.application_status.charAt(0).toUpperCase() + applicant.application_status.slice(1)}
                                                    </span>
                                                </div>
                                            </div>

                                            <h1 className="text-black text-lg">
                                                Basic Information
                                            </h1>
                                            <hr />
                                            <div className="space-y-1 my-3">
                                                <h1>
                                                    Full Name:
                                                    <span className="text-lochmara-400">
                                                        {" "}
                                                        {applicant.basic_info.first_name} {applicant.basic_info.last_name}
                                                    </span>
                                                </h1>
                                                <h1>
                                                    Email:{" "}
                                                    <span className="text-lochmara-400">
                                                        {" "}
                                                        {applicant.basic_info.email}
                                                    </span>
                                                </h1>
                                                <h1>
                                                    Contact No:
                                                    <span className="text-lochmara-400">
                                                        {" "}
                                                        {applicant.basic_info.contact_no}
                                                    </span>
                                                </h1>
                                                <h1>
                                                    Account Created: {new Date(applicant.basic_info.created_at).toLocaleDateString()}
                                                </h1>
                                            </div>

                                            <h1 className="text-black text-lg">
                                                Work Experience
                                            </h1>
                                            <hr />

                                            <div className="space-y-1 my-3">
                                                {applicant.work_experience.length === 0 ? (
                                                    <p>No work experience provided</p>
                                                ) : (
                                                    applicant.work_experience.map((exp) => (
                                                        <div key={exp.id} className="bg-neutral-50 border border-neutral-300 rounded-md p-3 mb-2">
                                                            <h1>
                                                                Company:
                                                                <span className="text-lochmara-400">
                                                                    {" "}
                                                                    {exp.company}
                                                                </span>
                                                            </h1>
                                                            <h1>
                                                                Address:
                                                                <span className="text-lochmara-400">
                                                                    {" "}
                                                                    {exp.address}
                                                                </span>
                                                            </h1>
                                                            <h1>
                                                                Position:
                                                                <span className="text-lochmara-400">
                                                                    {" "}
                                                                    {exp.position}
                                                                </span>
                                                            </h1>
                                                            <h1>
                                                                Years of Stay:
                                                                <span className="text-lochmara-400">
                                                                    {" "}
                                                                    {exp.worked_years}
                                                                </span>
                                                            </h1>
                                                        </div>
                                                    ))
                                                )}
                                            </div>

                                            <h1 className="text-black text-lg">
                                                CV Document
                                            </h1>
                                            <hr />

                                            <div className="my-3">
                                                <h1>
                                                    Click the button below to view the applicant's CV.
                                                </h1>
                                                <Button 
                                                    className="mt-2 mr-2"
                                                    onClick={() => handleViewResume(applicant.resume.resume_link)}
                                                >
                                                    View CV
                                                </Button>
                                            </div>
                                            
                                            <div className="mt-5 flex space-x-2">
                                                <Button 
                                                    className="bg-green-600 hover:bg-green-700"
                                                    disabled={actionLoading || applicant.application_status === 'hired'}
                                                    onClick={() => handleHireApplicant(applicant.basic_info.applicants_account_id)}
                                                >
                                                    {actionLoading ? "Processing..." : applicant.application_status === 'hired' ? "Already Hired" : "Hire Applicant"}
                                                </Button>
                                                <Button 
                                                    className="bg-red-600 hover:bg-red-700"
                                                    disabled={actionLoading || applicant.application_status === 'rejected'}
                                                    onClick={() => handleRejectApplicant(applicant.basic_info.applicants_account_id)}
                                                >
                                                    {actionLoading ? "Processing..." : applicant.application_status === 'rejected' ? "Already Rejected" : "Reject Applicant"}
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobApplicantsModal;