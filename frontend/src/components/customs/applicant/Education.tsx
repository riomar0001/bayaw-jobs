import { EducationSample } from "@/constants"
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Education {
    id: string;
    school_name: string;
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date: string;
}

const Education = () => {
    const { authStateApplicant } = useAuth();
    const [education, setEducation] = useState<Education[]>([]);
    const applicant_id = authStateApplicant?.user_id;

    // Dialog control states
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [currentEducation, setCurrentEducation] = useState<Education | null>(null);
    
    // Form states
    const [formData, setFormData] = useState({
        school_name: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: ""
    });

    // Format date to display only year
    const formatYearOnly = (dateString: string) => {
        if (!dateString) return "";
        // If it's already just a year, return it
        if (/^\d{4}$/.test(dateString)) return dateString;
        // Otherwise try to extract year from date string
        try {
            return new Date(dateString).getFullYear().toString();
        } catch (e) {
            return dateString;
        }
    };

    // Load education data
    useEffect(() => {
        const fetchEducation = async () => {
            if (!applicant_id) return;

            try {
                const response = await axios.get(`/api/applicant/education/${applicant_id}`);
                const data = response.data;

                if (data.success) {
                    setEducation(data.data || []);
                }
            } catch (error: any) {
                console.error(error.message);
                toast.error("Error", {
                    description: "Failed to load education data."
                });
            }
        }

        fetchEducation();
    }, [applicant_id]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Add new education
    const handleAddEducation = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/applicant/education', formData);
            
            if (response.data.success) {
                setEducation(prev => [...prev, response.data.data]);
                setAddDialogOpen(false);
                setFormData({
                    school_name: "",
                    degree: "",
                    field_of_study: "",
                    start_date: "",
                    end_date: ""
                });
                toast.success("Success", {
                    description: "Education added successfully."
                });
            }
        } catch (error: any) {
            console.error(error.message);
            toast.error("Error", {
                description: "Failed to add education."
            });
        }
    }

    // Edit education
    const handleEditEducation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentEducation) return;
        
        try {
            const response = await axios.put(`/api/applicant/education/${currentEducation.id}`, formData);
            
            if (response.data.success) {
                setEducation(prev => 
                    prev.map(edu => edu.id === currentEducation.id ? response.data.data : edu)
                );
                setEditDialogOpen(false);
                toast.success("Success", {
                    description: "Education updated successfully."
                });
            }
        } catch (error: any) {
            console.error(error.message);
            toast.error("Error", {
                description: "Failed to update education."
            });
        }
    }

    // Delete education
    const handleDeleteEducation = async () => {
        if (!currentEducation) return;
        
        try {
            const response = await axios.delete(`/api/applicant/education/${currentEducation.id}`);
            
            if (response.data.success) {
                setEducation(prev => prev.filter(edu => edu.id !== currentEducation.id));
                setDeleteDialogOpen(false);
                toast.success("Success", {
                    description: "Education deleted successfully."
                });
            }
        } catch (error: any) {
            console.error(error.message);
            toast.error("Error", {
                description: "Failed to delete education."
            });
        }
    }

    // Open edit dialog and set current education data
    const openEditDialog = (edu: Education) => {
        setCurrentEducation(edu);
        setFormData({
            school_name: edu.school_name,
            degree: edu.degree,
            field_of_study: edu.field_of_study,
            start_date: edu.start_date,
            end_date: edu.end_date
        });
        setEditDialogOpen(true);
    }

    // Open delete dialog and set current education
    const openDeleteDialog = (edu: Education) => {
        setCurrentEducation(edu);
        setDeleteDialogOpen(true);
    }

    return (
        <div className="bg-white border border-neutral-100 w-[750px] h-auto rounded-lg px-12 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="font-semibold text-xl">Education</h1>
                <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="flex items-center gap-1">
                            <PlusIcon size={16} /> Add Education
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Education</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddEducation} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="school_name">School Name</Label>
                                <Input 
                                    id="school_name" 
                                    name="school_name"
                                    value={formData.school_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="degree">Degree</Label>
                                <Input 
                                    id="degree" 
                                    name="degree"
                                    value={formData.degree}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="field_of_study">Field of Study</Label>
                                <Input 
                                    id="field_of_study" 
                                    name="field_of_study"
                                    value={formData.field_of_study}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="start_date">Start Year</Label>
                                <Input 
                                    id="start_date" 
                                    name="start_date"
                                    type="number"
                                    min="1900"
                                    max="2099"
                                    step="1"
                                    placeholder="YYYY"
                                    value={formData.start_date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end_date">End Year</Label>
                                <Input 
                                    id="end_date" 
                                    name="end_date"
                                    type="number"
                                    min="1900"
                                    max="2099"
                                    step="1"
                                    placeholder="YYYY"
                                    value={formData.end_date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">Add Education</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {education.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No education entries found. Add your first one!
                </div>
            ) : (
                education.map((edu: Education) => (
                    <section key={edu.id} className="mb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="font-semibold text-base">{edu.school_name}</h1>
                                <h1 className="font-normal text-base">{edu.degree} - {edu.field_of_study}</h1>
                                <h1 className="text-xs text-neutral-500 space-x-3 my-2">
                                    <span>{formatYearOnly(edu.start_date)} - {formatYearOnly(edu.end_date)}</span>
                                </h1>
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={() => openEditDialog(edu)}
                                >
                                    <Pencil size={16} />
                                </Button>
                                <Button 
                                    variant="destructive" 
                                    size="icon" 
                                    onClick={() => openDeleteDialog(edu)}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                        {edu !== education[education.length - 1] && <hr className="border my-6" />}
                    </section>
                ))
            )}

            {/* Edit Education Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Education</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditEducation} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit_school_name">School Name</Label>
                            <Input 
                                id="edit_school_name" 
                                name="school_name"
                                value={formData.school_name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_degree">Degree</Label>
                            <Input 
                                id="edit_degree" 
                                name="degree"
                                value={formData.degree}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_field_of_study">Field of Study</Label>
                            <Input 
                                id="edit_field_of_study" 
                                name="field_of_study"
                                value={formData.field_of_study}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_start_date">Start Year</Label>
                            <Input 
                                id="edit_start_date" 
                                name="start_date"
                                type="number"
                                min="1900"
                                max="2099"
                                step="1"
                                placeholder="YYYY"
                                value={formData.start_date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_end_date">End Year</Label>
                            <Input 
                                id="edit_end_date" 
                                name="end_date"
                                type="number"
                                min="1900"
                                max="2099"
                                step="1"
                                placeholder="YYYY"
                                value={formData.end_date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">Update Education</Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Education Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this education entry? This cannot be undone.</p>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteEducation}>
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Education