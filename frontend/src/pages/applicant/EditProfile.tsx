import { format } from "date-fns"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Smartphone, MapPin, Briefcase, DollarSign, Linkedin, CalendarIcon, Upload, Facebook, Twitter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useRef, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/contexts/authContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const EditProfile = () => {
    const navigate = useNavigate();
    const { authStateApplicant } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [location, setLocation] = useState("");
    const [professionalTitle, setProfessionalTitle] = useState("");
    const [website, setWebsite] = useState("");
    // Replace single workType with array of workTypes and selectedWorkTypes
    const [workTypes] = useState([
        { id: "FullTime", label: "Full Time" },
        { id: "PartTime", label: "Part Time" },
        { id: "Contractual", label: "Contract" },
        { id: "Freelance", label: "Freelance" },
        { id: "Internship", label: "Internship" }
    ]);
    const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [birthdate, setBirthdate] = useState<string>("");

    // Handle work type selection changes
    const handleWorkTypeChange = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedWorkTypes(prev => [...prev, id]);
        } else {
            setSelectedWorkTypes(prev => prev.filter(type => type !== id));
        }
    };

    useEffect(() => {
        if (authStateApplicant?.authenticated === false) {
            navigate("/login")
            return;
        }

        const fetchApplicantData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('/api/applicant/', { withCredentials: true });
                const { accountPersonalInfo } = response.data;

                if (accountPersonalInfo) {
                    setFirstName(accountPersonalInfo.first_name || "");
                    setLastName(accountPersonalInfo.last_name || "");
                    setEmail(accountPersonalInfo.email || "");
                    setContactNumber(accountPersonalInfo.contact_no || "");
                    setLocation(accountPersonalInfo.address || "");
                    setProfessionalTitle(accountPersonalInfo.professional_title || "");
                    setWebsite(accountPersonalInfo.website || "");

                    // Handle work types as an array
                    if (accountPersonalInfo.work_type && accountPersonalInfo.work_type.length > 0) {
                        setSelectedWorkTypes(accountPersonalInfo.work_type);
                    }

                    // Handle birthdate
                    if (accountPersonalInfo.date_of_birth) {
                        setBirthdate(accountPersonalInfo.date_of_birth);
                        // Try to parse the date string if it's a valid date
                        try {
                            const parsedDate = new Date(accountPersonalInfo.date_of_birth);
                            if (!isNaN(parsedDate.getTime())) {
                                setDate(parsedDate);
                            }
                        } catch (error) {
                            console.error("Error parsing date:", error);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching applicant data:", error);
                toast.error("Failed to load profile data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplicantData();
    }, [authStateApplicant, navigate]);

    const handleSaveChanges = async () => {
        try {
            setIsLoading(true);

            // Format the date to a string if it exists
            const formattedDate = date ? format(date, "yyyy-MM-dd") : null;

            // Create the request payload with work_type as an array
            const payload = {
                first_name: firstName,
                last_name: lastName,
                email: email,
                contact_no: contactNumber,
                address: location,
                professional_title: professionalTitle,
                website: website,
                work_type: selectedWorkTypes,
                date_of_birth: formattedDate
            };

            // Send PUT request to update profile
            await axios.put('/api/applicant/', payload, { withCredentials: true });

            toast("Profile Updated", {
                description: "Your profile has been updated successfully",
                className: "bg-lochmara-500/80 border border-none text-white"
            });

            navigate("/applicant/profile");
        } catch (error: any) {
            console.error("Error updating profile:", error);

            const errorMessage = error.response?.data?.message || "Failed to update profile";
            toast.error("Update Failed", {
                description: errorMessage
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-neutral-100 flex justify-center p-6 md:p-8 lg:p-12">
            <div className="bg-white border border-neutral-200 w-full max-w-4xl rounded-lg shadow-sm">
                <div className="flex justify-between items-center border-b border-neutral-100 p-6">
                    <h1 className="font-semibold text-xl">Edit your information</h1>
                    <Button
                        variant="outline"
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                        disabled={isLoading}
                        onClick={handleSaveChanges}
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>

                <div className="p-6">
                    <div className="mb-8">
                        <h1 className="text-lg font-medium mb-4">Personal Information</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <section>
                                <label className="text-sm text-gray-600 mb-1 block">First Name</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                    <Input
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
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
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                        value={contactNumber}
                                        onChange={(e) => setContactNumber(e.target.value)}
                                        className="bg-neutral-50 h-12 pl-10 border border-neutral-200 rounded-md"
                                        placeholder="Enter your contact number details"
                                    />
                                </div>
                            </section>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <section>
                                <label className="text-sm text-gray-600 mb-1 block">Professional Title</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                    <Input
                                        value={professionalTitle}
                                        onChange={(e) => setProfessionalTitle(e.target.value)}
                                        className="bg-neutral-50 h-12 pl-10 border border-neutral-200 rounded-md"
                                        placeholder="e.g. Software Developer, UX Designer"
                                    />
                                </div>
                            </section>

                            <section>
                                <label className="text-sm text-gray-600 mb-1 block">Website</label>
                                <div className="relative">
                                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                    <Input
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                        className="bg-neutral-50 h-12 pl-10 border border-neutral-200 rounded-md"
                                        placeholder="Enter your website URL"
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
                                <Label className="text-sm text-gray-600 mb-1 block">Work Types</Label>
                                <div className="bg-neutral-50 p-3 border border-neutral-200 rounded-md grid grid-cols-2 gap-2">
                                    {workTypes.map(type => (
                                        <div key={type.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`work-type-${type.id}`}
                                                checked={selectedWorkTypes.includes(type.id)}
                                                onCheckedChange={(checked) => handleWorkTypeChange(type.id, checked === true)}
                                            />
                                            <label
                                                htmlFor={`work-type-${type.id}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {type.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
                            <section>
                                <label className="text-sm text-gray-600 mb-1 block">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                    <Input
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="bg-neutral-50 h-12 pl-10 border border-neutral-200 rounded-md"
                                        placeholder="Enter the location of your residency"
                                    />
                                </div>
                            </section>
                        </div>

                        <div className="flex justify-end mt-8"></div>
                        <Button variant="outline" className="mr-3" onClick={() => window.history.back()}>Cancel</Button>
                        <Button
                            onClick={handleSaveChanges}
                            className="bg-lochmara-500 hover:bg-lochmara-500/80"
                            disabled={isLoading}
                        >
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default EditProfile;