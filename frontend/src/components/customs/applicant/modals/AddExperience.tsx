import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { ListPlus } from "lucide-react";

import React, { useState } from "react";
import axios from "axios";
import { set } from "date-fns";

const AddExperience = () => {
    const [company, setCompany] = useState("");
    const [position, setPosition] = useState("");
    const [address, setAddress] = useState("");
    const [yearsOfStay, setYearsOfStay] = useState("");

    const [isOpen, setIsOpen] = useState(false);

    const handleSaveChanges = async (e: any) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "/api/applicant/experience",
                {
                    company,
                    position,
                    location: address,
                    worked_years: yearsOfStay,
                },
                {
                    withCredentials: true,
                }
            );
            toast.success("Added Successful!", {
                description: response.data.message || "Experience Addedd successfully.",
                classNames: {
                    icon: "text-teal-800",
                    title: "text-teal-800",
                    description: "text-teal-800",
                    success: "bg-teal-100",
                },
            });

            setIsOpen(false);

            // Clear form fields
            setCompany("");
            setPosition("");
            setAddress("");
            setYearsOfStay("");
            setIsOpen(false);
            //refresh the page

            setTimeout(() => {
                window.location.reload();
            }, 1000);


        } catch (err: any) {
            console.log(err);

            toast.error("Adding Failed!", {
                description:
                    err.response?.data?.error || "An error occurred while Adding.",
                classNames: {
                    icon: "text-red-800",
                    title: "text-red-800",
                    description: "text-red-800",
                    error: "bg-red-100",
                },
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="link" size="sm" className="font-semibold text-base text-lochmara-500 flex items-center gap-x-2 hover:underline cursor-pointer">
                    <ListPlus /> Add Work Experience
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px] p-10">
                <DialogHeader>
                    <DialogTitle>Add Work Experience</DialogTitle>
                    <DialogDescription>
                        Add your work experience to your profile.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSaveChanges}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="company" className="text-left">
                                Company
                            </Label>
                            <Input
                                id="company"
                                className="col-span-3"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-left">
                                Address
                            </Label>
                            <Input
                                id="address"
                                className="col-span-3"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="position" className="text-left">
                                Position
                            </Label>
                            <Input
                                id="position"
                                className="col-span-3"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="yearsOfStay" className="text-left">
                                Years of Stay
                            </Label>
                            <Input
                                onKeyPress={(e) => !/^[1-9]$/.test(e.key) && e.preventDefault()}
                                maxLength={3}
                                id="yearsOfStay"
                                className="col-span-3"
                                value={yearsOfStay}
                                onChange={(e) => setYearsOfStay(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit" className="bg-lochmara-500 hover:bg-lochmara-500/80 mt-5  w-full">
                        Add Experience
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddExperience;