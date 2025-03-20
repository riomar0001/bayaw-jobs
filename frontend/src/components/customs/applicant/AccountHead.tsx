import { Button } from "@/components/ui/button"
import { images } from "@/constants"
import { FaLinkedin, FaFacebook, FaTwitter, FaGithub } from "react-icons/fa"
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { FiEdit2 } from "react-icons/fi";
import { useAuth } from "@/contexts/authContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AccountHeadProps {
    linkedInURL?: string;
}

const AccountHead = ({ linkedInURL }: AccountHeadProps) => {
    const { authStateApplicant } = useAuth();
    const applicant_id = authStateApplicant?.user_id;
    const [personalInfo, setPersonalInfo] = useState<any>({});
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSocialMediaDialogOpen, setIsSocialMediaDialogOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Social media state
    const [socialMedia, setSocialMedia] = useState<{
        facebook: string;
        twitter: string;
        linkedin: string;
        github: string;
    }>({
        facebook: '',
        twitter: '',
        linkedin: '',
        github: ''
    });

    useEffect(() => {
        const fetchPersonalInfo = async () => {
            try {
                const response = await axios.get("/api/applicant");
                const data = response.data;
                setPersonalInfo(data.accountPersonalInfo);
            } catch (error) {
                console.error(error);
            }
        }
        fetchPersonalInfo();

        // Fetch profile picture
        fetchProfilePicture();
        
        // Fetch social media
        fetchSocialMedia();
    }, []);

    const fetchProfilePicture = async () => {
        try {
            // We need to get the applicant ID - assuming it's available in the personalInfo
            // If not, you might need to adjust this to get the ID from another API or context
            const response = await axios.get(`/api/applicant/profile-picture/${applicant_id}`);
            if (response.data.success && response.data.profile_picture) {
                setProfilePicture(response.data.profile_picture);
            }
        } catch (error) {
            console.error("Failed to fetch profile picture:", error);
        }
    };

    const fetchSocialMedia = async () => {
        try {
            const response = await axios.get(`/api/applicant/social-media/${applicant_id}`);
            if (response.data.success && response.data.data) {
                setSocialMedia(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch social media:", error);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Please select an image to upload");
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('profile_picture', selectedFile);

            const response = await axios.put('/api/applicant/profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                toast.success("Profile picture updated successfully!");
                fetchProfilePicture();
                setIsDialogOpen(false);
                setSelectedFile(null);
                setPreviewUrl(null);
            } else {
                toast.error(response.data.message || "Failed to update profile picture");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred while updating profile picture");
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSocialMedia(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSocialMediaSubmit = async () => {
        try {
            const response = await axios.put('/api/applicant/social-media', socialMedia);
            
            if (response.data.success) {
                toast.success("Social media updated successfully!");
                setIsSocialMediaDialogOpen(false);
            } else {
                toast.error(response.data.message || "Failed to update social media");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred while updating social media");
            console.error(error);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const getSocialMediaUrl = (url: string) => {
        if (!url) return '#';
        return url.startsWith('http') ? url : `https://${url}`;
    };

    return (
        <div className="bg-white border border-neutral-100 w-[750px] h-auto rounded-lg px-12 py-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-x-6">
                    <div className="relative">
                        <img
                            src={profilePicture || images.sample_profile_1}
                            className="w-14 h-14 rounded-full object-cover"
                            alt="Profile"
                        />
                        <button
                            onClick={() => setIsDialogOpen(true)}
                            className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                            title="Edit profile picture"
                        >
                            <FiEdit2 size={12} />
                        </button>
                    </div>
                    <section>
                        <h1 className="font-semibold text-2xl">{personalInfo.first_name} {personalInfo.last_name}</h1>
                        <h1 className="font-normal text-neutral-600">{personalInfo.professional_title}</h1>
                        {/* <div className="flex items-center mt-2 gap-2">
                            {socialMedia.facebook && (
                                <a href={getSocialMediaUrl(socialMedia.facebook)} target="_blank" rel="noopener noreferrer">
                                    <FaFacebook className="text-blue-600 hover:opacity-80" />
                                </a>
                            )}
                            {socialMedia.twitter && (
                                <a href={getSocialMediaUrl(socialMedia.twitter)} target="_blank" rel="noopener noreferrer">
                                    <FaTwitter className="text-blue-400 hover:opacity-80" />
                                </a>
                            )}
                            {socialMedia.linkedin && (
                                <a href={getSocialMediaUrl(socialMedia.linkedin)} target="_blank" rel="noopener noreferrer">
                                    <FaLinkedin className="text-blue-700 hover:opacity-80" />
                                </a>
                            )}
                            {socialMedia.github && (
                                <a href={getSocialMediaUrl(socialMedia.github)} target="_blank" rel="noopener noreferrer">
                                    <FaGithub className="text-gray-800 hover:opacity-80" />
                                </a>
                            )}
                            <button
                                onClick={() => setIsSocialMediaDialogOpen(true)}
                                className="text-gray-500 hover:text-gray-700"
                                title="Edit social media"
                            >
                                <FiEdit2 size={14} />
                            </button>
                        </div> */}
                    </section>
                </div>
{/* 
                <a
                    href={linkedInURL ? (linkedInURL.startsWith('http') ? linkedInURL : `https://${linkedInURL}`) : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button className="bg-transparent text-lochmara-700 border border-lochmara-700 hover:bg-lochmara-700/80 hover:text-white">
                        <FaLinkedin /> LinkedIn Account
                    </Button>
                </a> */}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Profile Picture</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center space-y-4">
                        <div
                            className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden"
                            onClick={triggerFileInput}
                        >
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-gray-500">Click to select</span>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*"
                            className="hidden"
                        />
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsDialogOpen(false);
                                    setSelectedFile(null);
                                    setPreviewUrl(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpload}
                                disabled={!selectedFile || isUploading}
                            >
                                {isUploading ? "Uploading..." : "Upload"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Social Media Dialog */}
            <Dialog open={isSocialMediaDialogOpen} onOpenChange={setIsSocialMediaDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Social Media</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="facebook" className="flex items-center gap-2">
                                <FaFacebook className="text-blue-600" /> Facebook
                            </Label>
                            <Input
                                id="facebook"
                                name="facebook"
                                value={socialMedia.facebook}
                                onChange={handleSocialMediaChange}
                                placeholder="https://facebook.com/username"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="twitter" className="flex items-center gap-2">
                                <FaTwitter className="text-blue-400" /> Twitter
                            </Label>
                            <Input
                                id="twitter"
                                name="twitter"
                                value={socialMedia.twitter}
                                onChange={handleSocialMediaChange}
                                placeholder="https://twitter.com/username"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="linkedin" className="flex items-center gap-2">
                                <FaLinkedin className="text-blue-700" /> LinkedIn
                            </Label>
                            <Input
                                id="linkedin"
                                name="linkedin"
                                value={socialMedia.linkedin}
                                onChange={handleSocialMediaChange}
                                placeholder="https://linkedin.com/in/username"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="github" className="flex items-center gap-2">
                                <FaGithub className="text-gray-800" /> GitHub
                            </Label>
                            <Input
                                id="github"
                                name="github"
                                value={socialMedia.github}
                                onChange={handleSocialMediaChange}
                                placeholder="https://github.com/username"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsSocialMediaDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSocialMediaSubmit}>
                            Save Changes
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AccountHead