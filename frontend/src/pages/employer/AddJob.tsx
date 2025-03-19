import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import axios from "axios"

const AddJob = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        category: "",
        salary_from: "",
        salary_to: "",
        work_schedule: "",
        years_exp: ""
    })

    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const submitJob = async () => {
        // Validate all fields are filled
        const missingFields = Object.entries(formData).filter(([key, value]) => !value)
        
        if (missingFields.length > 0) {
            toast("Missing Fields", {
                description: "Please fill in all required fields",
                className: "bg-red-500 border border-none text-white"
            })
            return
        }

        setLoading(true)
        try {
            const response = await axios.post('/api/jobs', {
                ...formData,
                salary_from: parseInt(formData.salary_from),
                salary_to: parseInt(formData.salary_to),
                years_exp: parseInt(formData.years_exp)
            }, { withCredentials: true })

            if (response.data.success) {
                window.scrollTo({ top: 0, behavior: "instant" })
                toast("Job Added", {
                    description: "Job Added Successfully",
                    className: "bg-lochmara-500/80 border border-none text-white"
                })
                // Redirect to jobs page
                window.location.href = "/employer/jobs"
            }
        } catch (error: any) {
            toast("Failed to Add Job", {
                description: error.response?.data?.message || "Something went wrong",
                className: "bg-red-500 border border-none text-white"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="px-24 py-12">
            <Link to={"/employer/jobs"}>
                <Button className="mb-3">
                    <ArrowLeft size={15} />
                    Go Back
                </Button>
            </Link>

            <div className="flex gap-x-5">
                <div className="flex-1">
                    <div className="bg-white border border-neutral-300 rounded-lg w-full px-12 py-10">

                        <div className="mb-8">
                            <h1 className="text-2xl font-bold">Post New Job</h1>
                            <h1 className="text-base font-normal text-neutral-500">Fill in the form below to post a new job</h1>
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
                            <h1 className="font-semibold">Job Category</h1>
                            <Select onValueChange={(value) => handleSelectChange("category", value)}>
                                <SelectTrigger className="shadow-none w-1/3 h-10 bg-neutral-100/50">
                                    <SelectValue placeholder="Select Job Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="part-time">Part-Time</SelectItem>
                                    <SelectItem value="full-time">Full-Time</SelectItem>
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
                                    type="number"
                                    className="shadow-none h-10 bg-neutral-100/50" 
                                    placeholder="Min Salary" 
                                />
                                <Input 
                                    name="salary_to"
                                    value={formData.salary_to}
                                    onChange={handleChange}
                                    type="number"
                                    className="shadow-none h-10 bg-neutral-100/50" 
                                    placeholder="Max Salary" 
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <h1 className="font-semibold">Work Schedule</h1>
                            <Select onValueChange={(value) => handleSelectChange("work_schedule", value)}>
                                <SelectTrigger className="shadow-none w-1/3 h-10 bg-neutral-100/50">
                                    <SelectValue placeholder="Select Work Schedule" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Remote">Remote</SelectItem>
                                    <SelectItem value="On-site">On-Site</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mt-4">
                            <h1 className="font-semibold">Years of Experience</h1>
                            <Input 
                                name="years_exp"
                                value={formData.years_exp}
                                onChange={handleChange}
                                type="number"
                                className="shadow-none w-1/3 h-10 bg-neutral-100/50" 
                                placeholder="Years Required" 
                            />
                        </div>

                    </div>
                </div>

                <div>
                    <div className="bg-white border border-neutral-300 rounded-lg p-6">
                        <h1 className="font-semibold">Actions</h1>
                        <h1 className="font-light text-neutral-500">Perform actions on the Job below.</h1>
                        <hr className="my-5" />
                        <Button
                            onClick={submitJob}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default AddJob