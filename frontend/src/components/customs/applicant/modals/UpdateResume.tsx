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
import { PencilLine } from "lucide-react"
import axios from "axios";

import { UserPen } from "lucide-react";
import React, { useState, useEffect } from "react";

const UpdateResume = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (event: any) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        if (!selectedFile) return;

        setIsUploading(true);

        const formData = new FormData();
        formData.append("resume", selectedFile);

        try {
            const response = await axios.put("/api/applicant/resume", formData, {
                withCredentials: true,
            });
            toast.success("Update Successful!", {
                description:
                    response.data.message ||
                    "Your contact has been updated successfully.",
                classNames: {
                    icon: "text-teal-800",
                    title: "text-teal-800",
                    description: "text-teal-800",
                    success: "bg-teal-100",
                },
            });
            setIsOpen(false);
            setIsUploading(false);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err: any) {
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

    return (
        <Dialog
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <DialogTrigger asChild>
                <Button variant="link" size="sm" className="font-semibold text-base text-lochmara-500 flex items-center gap-x-2 hover:underline cursor-pointer">
                    <PencilLine size={15} />Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Update your CV/Resume</DialogTitle>
                    <DialogDescription>
                        Make changes to your CV/Resume here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col space-y-2">
                            <Label>CV/Resume</Label>
                            <Input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isUploading} className="bg-lochmara-500 hover:bg-lochmara-500/80">
                            {isUploading ? "Uploading..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateResume;