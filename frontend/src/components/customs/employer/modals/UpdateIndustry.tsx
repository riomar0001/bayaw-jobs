import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel } from "@/components/ui/select";

const UpdateIndustry = () => {
    const [open, setOpen] = useState(false);
    const [industry, setIndustry] = useState("");
    const [industries, setIndustries] = useState([]);
    const [isOtherSelected, setIsOtherSelected] = useState(false);
    const [customIndustry, setCustomIndustry] = useState("");

    useEffect(() => {
        const fetchIndustries = async () => {
            try {
                const response = await axios.get(
                    "/api/company/industries",
                    {
                        withCredentials: true,
                    }
                );
                setIndustries(response.data.industries);
            } catch (error) {
                console.error("Failed to fetch industries", error);
            }
        };

        fetchIndustries();
    }, []);

    const handleIndustryChange = (value: any) => {
        setIndustry(value);
        setIsOtherSelected(value === "other");
    };

    const handleCustomIndustryChange = (e: any) => {
        setCustomIndustry(e.target.value);
    };

    const handleSubmit = async () => {
        const industryToSubmit = isOtherSelected ? customIndustry : industry;

        if (!industryToSubmit) {
            alert("Please select or enter an industry");
            return;
        }

        try {
            await axios.put(
                "/api/company/industry",
                { industry_name: industryToSubmit },
                { withCredentials: true }
            );
            alert("Industry updated successfully!");
            setOpen(false);
            // Reload page
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Failed to update industry. Please try again.");
        }
    };

    return (
        <>
            <Button onClick={() => setOpen(true)} variant="link" className="text-neutral-500">
                Update Industry
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Industry</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="sm:col-span-2">
                            <Select value={industry} onValueChange={handleIndustryChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select an Industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Industries</SelectLabel>
                                        {industries.map((industry: any) => (
                                            <SelectItem key={industry.industry_id} value={industry.industry_name}>
                                                {industry.industry_name}
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {isOtherSelected && (
                                <Input
                                    placeholder="Enter your industry"
                                    className="mt-2"
                                    value={customIndustry}
                                    onChange={handleCustomIndustryChange}
                                />
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setOpen(false)} variant="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={!industry && !customIndustry}>
                            Update
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UpdateIndustry;