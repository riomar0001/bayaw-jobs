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

import { UserPen, PencilLine } from "lucide-react";

import React, { useState } from "react";
import axios from "axios";

const UpdateExperience = ({ experience }: any) => {
    const [company, setCompany] = useState(experience.company);
    const [position, setPosition] = useState(experience.position);
    const [address, setAddress] = useState(experience.location);
    const [yearsOfStay, setYearsOfStay] = useState(experience.worked_years);

    const [isOpen, setIsOpen] = useState(false);

    const handleSaveChanges = async (e: any) => {
        console.log(experience.experience_id);
        e.preventDefault();
        try {
            const response = await axios.put(
                `/api/applicant/experience/${experience.id}`,
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
            toast.success("Update Successful!", {
                description:
                    response.data.message || "Experience Updated successfully.",
                classNames: {
                    icon: "text-teal-800",
                    title: "text-teal-800",
                    description: "text-teal-800",
                    success: "bg-teal-100",
                },
            });

            setIsOpen(false);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err: any) {
            console.log(err);

            toast.error("Update Failed!", {
                description:
                    err.response?.data?.error || "An error occurred while updating.",
                classNames: {
                    icon: "text-red-800",
                    title: "text-red-800",
                    description: "text-red-800",
                    error: "bg-red-100",
                },
            });
        }
    };

    const handleDeleteExperience = async () => {
        try {
            const response = await axios.delete(
                `/api/applicant/experience/${experience.id}`,
                {
                    withCredentials: true,
                }
            );
            toast.success("Deleted Successful!", {
                description:
                    response.data.message || "Experience deleted successfully.",
                classNames: {
                    icon: "text-teal-800",
                    title: "text-teal-800",
                    description: "text-teal-800",
                    success: "bg-teal-100",
                },
            });
            setIsOpen(false);
            window.location.reload();
        } catch (err: any) {
            toast.error("Delete Failed!", {
                description:
                    err.response?.data?.error || "An error occurred while deletings.",
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
                <Button variant="link" size="sm">
                    <PencilLine /> Edit Work Experience
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Work Experience</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSaveChanges}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-left">
                                Company
                            </Label>
                            <Input
                                className="col-span-3"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-left">
                                Address
                            </Label>
                            <Input
                                className="col-span-3"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-left">
                                Position
                            </Label>
                            <Input
                                className="col-span-3"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-left">
                                Years of Stay
                            </Label>
                            <Input
                                className="col-span-3"
                                value={yearsOfStay}
                                onChange={(e) => setYearsOfStay(e.target.value)}
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-lochmara-500 text-white hover:bg-lochmara-500/80">
                        Save changes
                    </Button>
                </form>
                <DialogFooter>
                    <Button
                        onClick={handleDeleteExperience}
                        className="w-full"
                        variant="destructive"
                    >
                        Delete Experience
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateExperience;