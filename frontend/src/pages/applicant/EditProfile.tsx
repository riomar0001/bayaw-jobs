import { format } from "date-fns"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Smartphone, MapPin, Briefcase, DollarSign, Linkedin, CalendarIcon, Upload, Facebook, Twitter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useRef } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { Link } from "react-router-dom";

import { useEffect } from "react"
import { useAuth } from "@/contexts/authContext"
import { useNavigate } from "react-router-dom"

const EditProfile = ({
    firstName,
    lastName,
    email,
    contactNumber,
    linkedInURL,
    facebookURL,
    twitterURL,
    birthdate,
    salaryExpectation,
    location,
    profileImage }: EditProfileProps) => {

    const navigate = useNavigate();
    const { authStateApplicant } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (authStateApplicant?.authenticated === false) {
            navigate("/login")
        }
    }, [authStateApplicant])

    const [date, setDate] = useState<Date | undefined>(birthdate ? new Date(birthdate) : undefined)

    // Profile image state
    const [imagePreview, setImagePreview] = useState<string | null>(profileImage || null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Handle image upload
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle image removal
    const handleRemoveImage = () => {
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Trigger file input click
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="bg-neutral-100 flex justify-center p-6 md:p-8 lg:p-12">
            <div className="bg-white border border-neutral-200 w-full max-w-4xl rounded-lg shadow-sm">
                <div className="flex justify-between items-center border-b border-neutral-100 p-6">
                    <h1 className="font-semibold text-xl">Edit your information</h1>
                    <Button variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200">
                        Save Changes
                    </Button>
                </div>

                <div className="p-6">

                    <div className="mb-8">
                        {/* Upload image section */}
                        <h2 className="text-lg font-medium mb-4">Profile Picture</h2>
                        <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
                            {/* Image preview */}
                            <div className="w-32 h-32 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden border border-neutral-200">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Profile preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-neutral-400 flex flex-col items-center justify-center">
                                        <Upload size={24} />
                                        <span className="text-xs mt-1">No image</span>
                                    </div>
                                )}
                            </div>

                            {/* Upload controls */}
                            <div className="flex flex-col gap-3 flex-1">
                                <p className="text-sm text-gray-600">Upload a profile picture. JPG or PNG. Max 5MB.</p>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="bg-neutral-50 border border-neutral-200"
                                        type="button"
                                        onClick={triggerFileInput}
                                    >
                                        Upload Image
                                    </Button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg, image/png"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />

                                    {imagePreview && (
                                        <Button
                                            variant="outline"
                                            className="text-red-500 hover:text-red-600 border-red-100 hover:bg-red-50"
                                            onClick={handleRemoveImage}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                                {imageFile && (
                                    <p className="text-sm text-gray-500">
                                        {imageFile.name} ({(imageFile.size / (1024 * 1024)).toFixed(2)} MB)
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-lg font-medium mb-4">Personal Information</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <section>
                                <label className="text-sm text-gray-600 mb-1 block">First Name</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                    <Input
                                        defaultValue={firstName}
                                        className="bg-neutral-50 h-12 pl-10 border border-neutral-200 rounded-md"
                                        placeholder="Enter your first name"
                                    />
                                </div>
                            </section>

                            <section>
                                <label className="text-sm text-gray-600 mb-1 block">Last Name</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                    <Input
                                        defaultValue={lastName}
                                        className="bg-neutral-50 h-12 pl-10 border border-neutral-200 rounded-md"
                                        placeholder="Enter your last name"
                                    />
                                </div>
                            </section>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <section>
                                <label className="text-sm text-gray-600 mb-1 block">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                    <Input
                                        defaultValue={email}
                                        className="bg-neutral-50 h-12 pl-10 border border-neutral-200 rounded-md"
                                        placeholder="Enter your email address"
                                    />
                                </div>
                            </section>

                            <section>
                                <label className="text-sm text-gray-600 mb-1 block">Phone Number</label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                    <Input
                                        defaultValue={contactNumber}
                                        className="bg-neutral-50 h-12 pl-10 border border-neutral-200 rounded-md"
                                        placeholder="Enter your contact number details"
                                    />
                                </div>
                            </section>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-lg font-medium mb-4">Socials</h1>
                        <div className="mb-8 space-y-3">
                            <section>
                                <label className="text-sm text-gray-600 mb-1 block">LinkedIn Profile</label>
                                <div className="relative">
                                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                    <Input
                                        defaultValue={linkedInURL}
                                        className="bg-neutral-50 h-12 pl-10 border border-neutral-200 rounded-md"
                                        placeholder="Enter your LinkedIn url (optional)"
                                    />
                                </div>
                            </section>
                            <section>
                                <label className="text-sm text-gray-600 mb-1 block">Facebook Profile</label>
                                <div className="relative">
                                    <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                    <Input
                                        defaultValue={facebookURL}
                                        className="bg-neutral-50 h-12 pl-10 border border-neutral-200 rounded-md"
                                        placeholder="Enter your facebook url (optional)"
                                    />
                                </div>
                            </section>
                            <section>
                                <label className="text-sm text-gray-600 mb-1 block">Twitter Profile</label>
                                <div className="relative">
                                    <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                    <Input
                                        defaultValue={twitterURL}
                                        className="bg-neutral-50 h-12 pl-10 border border-neutral-200 rounded-md"
                                        placeholder="Enter your twitter url (optional)"
                                    />
                                </div>
                            </section>
                        </div>
                    </div>


                    <div>
                        <h1 className="text-lg font-medium mb-4">Additional Information</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                            <section>
                                <label className="text-sm text-gray-600 mb-1 block">Birth Date</label>
                                <div className="relative">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "bg-neutral-50 h-12 pl-10 border border-neutral-200 rounded-md w-full justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="absolute left-3 h-4 w-4 text-gray-500" />
                                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent align="start" className=" w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                captionLayout="dropdown-buttons"
                                                selected={date}
                                                onSelect={setDate}
                                                fromYear={1960}
                                                toYear={2030}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </section>

                            <section>
                                <label className="text-sm text-gray-600 mb-1 block">Work Type</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                    <Select defaultValue="remote">
                                        <SelectTrigger className="bg-neutral-50 h-12 pl-10 border border-neutral-200 rounded-md">
                                            <SelectValue placeholder="Select work type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="remote">Remote</SelectItem>
                                            <SelectItem value="fulltime">Fulltime</SelectItem>
                                            <SelectItem value="parttime">Part-Time</SelectItem>
                                            <SelectItem value="intership">Intership</SelectItem>
                                            <SelectItem value="freelance">Freelance</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </section>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
                            <section>
                                <label className="text-sm text-gray-600 mb-1 block">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                    <Input
                                        defaultValue={location}
                                        className="bg-neutral-50 h-12 pl-10 border border-neutral-200 rounded-md"
                                        placeholder="Enter the location of your residency"
                                    />
                                </div>
                            </section>

                        </div>

                        <div className="flex justify-end mt-8">
                            <Button variant="outline" className="mr-3" onClick={() => window.history.back()}>Cancel</Button>
                            <Link to={"/applicant/profile"}>
                                <Button onClick={() => {
                                    window.scrollTo({ top: 0, behavior: "instant" });
                                    toast("Profile Changed", {
                                        description:
                                            "New profile details is set to the account",
                                        className: "bg-lochmara-500/80 border border-none text-white"
                                    });
                                }} className="bg-lochmara-500 hover:bg-lochmara-500/80"
                                >
                                    Save Changes
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;