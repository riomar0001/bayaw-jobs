import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import axios from "axios"
import Spinner from "./Spinner"

const EditJob = () => {
    const { job_id } = useParams();
    const navigate = useNavigate();
    const [jobData, setJobData] = useState<any | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState<boolean>(false)

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        category: "",
        salary_from: "",
        salary_to: "",
        work_schedule: "",
        years_exp: ""
    });

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`/api/jobs/${job_id}`)
                if (response.data.success) {
                    const job = response.data.job;
                    setJobData(job)
                    setFormData({
                        title: job.title || "",
                        description: job.description || "",
                        location: job.location || "",
                        category: job.category || "",
                        salary_from: job.salary_from?.toString() || "",
                        salary_to: job.salary_to?.toString() || "",
                        work_schedule: job.work_schedule || "",
                        years_exp: job.years_exp?.toString() || ""
                    })
                } else {
                    setError("Failed to load job details")
                }
            } catch (err) {
                setError("An error occurred while fetching job details")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        if (job_id) {
            fetchJobDetails()
        }
    }, [job_id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            
            // Transform the data to match the expected backend field names
            const updateData = {
                new_title: formData.title,
                new_description: formData.description,
                new_location: formData.location,
                new_category: formData.category,
                new_salary_from: formData.salary_from,
                new_salary_to: formData.salary_to,
                new_work_schedule: formData.work_schedule,
                new_years_exp: formData.years_exp
            };
            
            // Make the PUT request to update the job
            const response = await axios.put(`/api/jobs/${job_id}`, updateData);
            
            if (response.data.success) {
                window.scrollTo({ top: 0, behavior: "instant" });
                toast("Success", {
                    description: "Job Details Updated Successfully",
                    className: "bg-lochmara-500/80 border border-none text-white"
                });
                navigate("/employer/jobs");
            } else {
                toast("Error", {
                    description: response.data.message || "Failed to update job",
                    className: "bg-red-500/80 border border-none text-white"
                });
            }
        } catch (err: any) {
            console.error("Error updating job:", err);
            toast("Error", {
                description: err.response?.data?.message || "An error occurred while updating the job",
                className: "bg-red-500/80 border border-none text-white"
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (error) return <div className="px-36 py-12 text-red-500">{error}</div>;

    return (
        <div className="px-36 py-12">
            <Link to={"/employer/jobs/job-details/" + job_id}>
                <Button className="mb-3">
                    <ArrowLeft size={15} />
                    Go Back
                </Button>
            </Link>

            {loading ? (
                <div className="h-80 flex items-center justify-center">
                    <Spinner />
                </div>
            ) : (
                <div className="flex gap-x-5">
                    <section className="flex-1">
                        <div className="bg-white border border-neutral-300 rounded-lg w-full px-12 py-10">
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold">Edit Job Details</h1>
                                <h1 className="text-base font-normal text-neutral-500">Edit the job details below.</h1>
                            </div>

                            <div className="mt-4">
                                <h1 className="font-semibold">Position</h1>
                                <Input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="shadow-none h-10 bg-neutral-100/50"
                                />
                            </div>

                            <div className="mt-4">
                                <h1 className="font-semibold">Job Description</h1>
                                <Textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="shadow-none h-24 bg-neutral-100/50"
                                />
                            </div>

                            <div className="mt-4">
                                <h1 className="font-semibold">Job Address</h1>
                                <Input
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="shadow-none h-10 bg-neutral-100/50"
                                />
                            </div>

                            <div className="mt-4">
                                <h1 className="font-semibold">Work Schedule</h1>
                                <Select
                                    value={formData.work_schedule}
                                    onValueChange={(value) => handleSelectChange("work_schedule", value)}
                                >
                                    <SelectTrigger className="shadow-none w-1/3 h-10 bg-neutral-100/50">
                                        <SelectValue placeholder="Select Job Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Part Time">Part-Time</SelectItem>
                                        <SelectItem value="Full Time">Full-Time</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="mt-4">
                                <h1 className="font-semibold">Salary Range</h1>
                                <div className="flex gap-x-5">
                                    <Input
                                        name="salary_from"
                                        value={formData.salary_from}
                                        onChange={handleChange}
                                        className="shadow-none h-10 bg-neutral-100/50"
                                        placeholder="Min Salary"
                                    />
                                    <Input
                                        name="salary_to"
                                        value={formData.salary_to}
                                        onChange={handleChange}
                                        className="shadow-none h-10 bg-neutral-100/50"
                                        placeholder="Max Salary"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <h1 className="font-semibold">Job Category</h1>
                                <Select

                                    value={formData.category}
                                    onValueChange={(value) => handleSelectChange("category", value)}
                                >
                                    <SelectTrigger className="shadow-none w-1/3 h-10 bg-neutral-100/50">
                                        <SelectValue placeholder="Select Work Schedule" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Remote">Remote</SelectItem>
                                        <SelectItem value="On-site">On-site</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="mt-4">
                                <h1 className="font-semibold">Years of Experience</h1>
                                <Input
                                    name="years_exp"
                                    value={formData.years_exp}
                                    onChange={handleChange}
                                    className="shadow-none h-10 bg-neutral-100/50"
                                    placeholder="Required experience in years"
                                    type="number"
                                />
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="bg-white border border-neutral-300 rounded-lg p-6">
                            <h1 className="font-semibold">Actions</h1>
                            <h1 className="font-light text-neutral-500">Update the job details below.</h1>
                            <hr className="my-5" />
                            <Button
                                onClick={handleSubmit}
                                className="w-full"
                                disabled={submitting}
                            >
                                {submitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    )
}

export default EditJob