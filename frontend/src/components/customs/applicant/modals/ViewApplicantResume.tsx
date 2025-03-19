import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { FileText } from "lucide-react";

import React from "react";

interface ViewApplicantResumeProps {
    cv_file: string;
}

const ViewApplicantResume = ({ cv_file }: ViewApplicantResumeProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-white text-lochmara-500 border border-lochmara-500 hover:border-lochmara-500/80 hover:text-lochmara-500/80 rounded-full hover:bg-transparent">
                    <FileText /> View
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>CV/Resume</DialogTitle>
                </DialogHeader>
                <div className="mt-2 flex flex-col items-center h-auto">
                    <object
                        data={cv_file}
                        type="application/pdf"
                        width="600"
                        height="700"
                        className="rounded-lg"
                    >
                        <p>
                            PDF could not be displayed.{" "}
                            <a href={cv_file} target="_blank" rel="noopener noreferrer">
                                Click here to download the CV.
                            </a>
                        </p>
                    </object>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewApplicantResume;