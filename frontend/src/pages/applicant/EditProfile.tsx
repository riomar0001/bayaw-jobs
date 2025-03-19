import { format } from "date-fns"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Smartphone, MapPin, Briefcase, DollarSign, Linkedin, CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { Link } from "react-router-dom";


const EditProfile = ({
    firstName,
    lastName,
    email,
    contactNumber,
    linkedInURL,
    birthdate,
    salaryExpectation,
    location }: EditProfileProps) => {


    const [date, setDate] = useState<Date | undefined>(birthdate ? new Date(birthdate) : undefined)

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
                        <h1 className="text-lg font-medium mb-4">Personal Information</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <section>
                                <label className="text-sm text-gray-600 mb-1 block">First Name</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                    <Input
                                        defaultValue={firstName}
                                        className="bg-neutral-50 h-12 pl-10 border border-neutral-200 rounded-md"
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
                                    />
                                </div>
                            </section>
                        </div>

                        <div className="mb-6">
                            <section>
                                <label className="text-sm text-gray-600 mb-1 block">LinkedIn Profile</label>
                                <div className="relative">
                                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                    <Input
                                        defaultValue={linkedInURL}
                                        className="bg-neutral-50 h-12 pl-10 border border-neutral-200 rounded-md"
                                    />
                                </div>
                            </section>
                        </div>
                    </div>


                    <div>
                        <h1 className="text-lg font-medium mb-4">Additional Information</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                                <label className="text-sm text-gray-600 mb-1 block">Salary Expectation</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                    <Input
                                        defaultValue={salaryExpectation}
                                        className="bg-neutral-50 h-12 pl-10 border border-neutral-200 rounded-md"
                                    />
                                </div>
                            </section>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <section>
                                <label className="text-sm text-gray-600 mb-1 block">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                    <Input
                                        defaultValue={location}
                                        className="bg-neutral-50 h-12 pl-10 border border-neutral-200 rounded-md"
                                    />
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