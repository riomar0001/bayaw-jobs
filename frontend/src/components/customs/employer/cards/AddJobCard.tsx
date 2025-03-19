import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState, ChangeEvent } from "react"
import { Upload, X } from "lucide-react"

const AddJobCard: React.FC = () => {
    const [image, setImage] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        if (file) {
            setImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = (): void => {
        setImage(null)
        setPreview(null)
    }

    return (
        <section className="flex-1">
            <div className="bg-white border border-neutral-300 rounded-lg w-full px-12 py-10">
                {/* <div className="mb-6">
                    <h1 className="font-semibold mb-2">Company Logo</h1>
                    <div className="relative">
                        {preview ? (
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-neutral-300">
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    onClick={removeImage}
                                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                                    type="button"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer bg-neutral-100/50 hover:bg-neutral-100">
                                <div className="flex flex-col items-center justify-center">
                                    <Upload size={24} className="text-neutral-500" />
                                    <span className="mt-1 text-xs text-neutral-500">Upload logo</span>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        )}
                    </div>
                </div> */}

                <div className="mb-8">
                    <h1 className="text-2xl font-bold">Post New Job</h1>
                    <h1 className="text-base font-normal text-neutral-500">Fill in the form below to post a new job</h1>
                </div>

                <div className="mt-4">
                    <h1 className="font-semibold">Position</h1>
                    <Input className="shadow-none h-10 bg-neutral-100/50" />
                </div>

                <div className="mt-4">
                    <h1 className="font-semibold">Job Description</h1>
                    <Textarea className="shadow-none h-24 bg-neutral-100/50" />
                </div>

                <div className="mt-4">
                    <h1 className="font-semibold">Job Address</h1>
                    <Input className="shadow-none h-10 bg-neutral-100/50" />
                </div>

                <div className="mt-4">
                    <h1 className="font-semibold">Job Category</h1>
                    <Select>
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
                        <Input className="shadow-none h-10 bg-neutral-100/50" placeholder="Min Salary" />
                        <Input className="shadow-none h-10 bg-neutral-100/50" placeholder="Max Salary" />
                    </div>
                </div>

                <div className="mt-4">
                    <h1 className="font-semibold">Work Schedule</h1>
                    <Select>
                        <SelectTrigger className="shadow-none w-1/3 h-10 bg-neutral-100/50">
                            <SelectValue placeholder="Select Work Schedule" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="remote">Remote</SelectItem>
                            <SelectItem value="on-site">On-Site</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

            </div>
        </section>
    )
}

export default AddJobCard