import { useState, useEffect } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import Compressor from "compressorjs";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Building, Mail, Phone, MapPin, FileText, Briefcase, Loader2, PencilLine } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/customs/employer/Spinner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CompanyData {
  id: string;
  username: string;
  email: string;
  companies_information: {
    name: string;
    address: string;
    description: string;
    contact_no: string;
    email: string;
    industry: {
      id: string;
      name: string;
    };
  };
  companies_logo: {
    logo_file: string;
  };
  companies_social_media: any;
  logoUrl: string;
}

const ProfileEmployer = () => {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [industries, setIndustries] = useState<any[]>([]);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue, reset, watch, control } = useForm();

  useEffect(() => {
    fetchCompanyData();
    fetchIndustries();
  }, []);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/company/company");
      setCompanyData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch company data:", error);
      toast.error("Failed to load company profile");
      setLoading(false);
    }
  };

  const fetchIndustries = async () => {
    try {
      const response = await axios.get("/api/company/industries");
      setIndustries(response.data.data.industries);
    } catch (error) {
      console.error("Failed to fetch industries:", error);
    }
  };

  const handleIndustryChange = (value: string) => {
    setValue("industry", value);
    setIsOtherSelected(value === "other");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      setSelectedFile(file);
      
      // Set the value in the form
      setValue('logo', e.target.files);
    }
  };

  const compressImage = (imageFile: File) => {
    return new Promise((resolve, reject) => {
      new Compressor(imageFile, {
        quality: 0.6,
        maxWidth: 1920,
        success: (compressedResult) => resolve(compressedResult),
        error: (error) => reject(error),
      });
    });
  };

  // Individual update functions for each type
  const updateCompanyInfo = async (data: any) => {
    console.log("Updating company info with data:", data);
    setUpdating(true);
    try {
      await axios.put("/api/company/update/info", {
        new_name: data.name,
        new_address: data.address,
        new_description: data.description,
        new_email: data.companyEmail,
        new_contact_no: data.contactNo,
      }, { withCredentials: true });
      
      toast.success("Company information updated successfully");
      setCurrentModal(null);
      await fetchCompanyData();
      reset();
    } catch (error: any) {
      console.error("Failed to update company information:", error);
      toast.error(error.response?.data?.message || "Failed to update company information");
    } finally {
      setUpdating(false);
    }
  };

  const updateIndustry = async (data: any) => {
    console.log("Updating industry with data:", data);
    setUpdating(true);
    try {
      const industryName = isOtherSelected ? data.otherIndustry : data.industry;
      console.log("Selected industry name:", industryName);
      
      await axios.put("/api/company/industry", {
        industry_name: industryName,
      }, { withCredentials: true });
      
      toast.success("Industry updated successfully");
      setCurrentModal(null);
      await fetchCompanyData();
      reset();
      setIsOtherSelected(false);
    } catch (error: any) {
      console.error("Failed to update industry:", error);
      toast.error(error.response?.data?.message || "Failed to update industry");
    } finally {
      setUpdating(false);
    }
  };

  const updateLogo = async () => {
    if (!selectedFile) {
      toast.error("Please select a logo file");
      return;
    }

    setUpdating(true);
    try {
      const formData = new FormData();
      const compressedLogo = await compressImage(selectedFile);
      formData.append("logo", compressedLogo as any);
      
      await axios.put("/api/company/logo", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      toast.success("Logo updated successfully");
      setCurrentModal(null);
      await fetchCompanyData();
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error: any) {
      console.error("Failed to update logo:", error);
      toast.error(error.response?.data?.message || "Failed to update logo");
    } finally {
      setUpdating(false);
    }
  };

  const updateAccountEmail = async (data: any) => {
    console.log("Updating account email with:", data.email);
    setUpdating(true);
    try {
      await axios.put("/api/company/update", {
        new_email: data.email,
      }, { withCredentials: true });
      
      toast.success("Email updated successfully");
      setCurrentModal(null);
      await fetchCompanyData();
      reset();
    } catch (error: any) {
      console.error("Failed to update email:", error);
      toast.error(error.response?.data?.message || "Failed to update email");
    } finally {
      setUpdating(false);
    }
  };

  const updatePassword = async (data: any) => {
    console.log("Updating password");
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    setUpdating(true);
    try {
      await axios.put("/api/company/password", {
        current_password: data.currentPassword,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword,
      }, { withCredentials: true });
      
      toast.success("Password updated successfully");
      setCurrentModal(null);
      reset();
    } catch (error: any) {
      console.error("Failed to update password:", error);
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setUpdating(false);
    }
  };

  const deleteCompanyAccount = async () => {
    setUpdating(true);
    try {
      await axios.delete("/api/company/");
      toast.success("Company account deleted successfully");
      window.location.href = "/";
    } catch (error: any) {
      console.error("Failed to delete company:", error);
      toast.error("Failed to delete company account");
      setUpdating(false);
    }
  };

  const prepareModalData = (modalType: string) => {
    setCurrentModal(modalType);
    reset();
    
    switch (modalType) {
      case "companyInfo":
        setValue("name", companyData?.companies_information.name);
        setValue("address", companyData?.companies_information.address);
        setValue("description", companyData?.companies_information.description);
        setValue("companyEmail", companyData?.companies_information.email);
        setValue("contactNo", companyData?.companies_information.contact_no);
        break;
      case "industry":
        setValue("industry", companyData?.companies_information.industry.name);
        break;
      case "accountEmail":
        setValue("email", companyData?.email);
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <Link to="/employer/jobs" className="inline-flex items-center mb-6">
        <Button variant="ghost" className="flex items-center gap-2">
          <ArrowLeft size={18} />
          <span>Go Back to Jobs</span>
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="md:col-span-2">
          <Card className="shadow-md">
            <CardHeader className="flex flex-col md:flex-row md:items-center gap-4 pb-4 border-b">
              <Avatar className="h-24 w-24">
                <AvatarImage src={companyData?.logoUrl} alt={companyData?.companies_information.name} />
                <AvatarFallback className="bg-lochmara-500 text-white text-lg">
                  {companyData?.companies_information.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{companyData?.companies_information.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <Briefcase size={15} /> {companyData?.companies_information.industry.name}
                </CardDescription>
              </div>
              <div className="ml-auto">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => prepareModalData("logo")}
                  className="text-lochmara border-lochmara hover:bg-lochmara-500 hover:text-white"
                >
                  <PencilLine size={14} className="mr-1" /> Update Logo
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <h3 className="font-medium text-lg flex items-center gap-2">
                    <Building size={18} className="text-lochmara" /> Company Information
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => prepareModalData("companyInfo")}
                      className="ml-2 h-7 px-2 text-xs text-lochmara hover:text-lochmara hover:bg-lochmara-500/10"
                    >
                      <PencilLine size={14} className="mr-1" /> Edit
                    </Button>
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Email</Label>
                    <p className="flex items-center gap-2">
                      <Mail size={15} className="text-gray-500" />
                      {companyData?.companies_information.email}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-gray-500">Contact Number</Label>
                    <p className="flex items-center gap-2">
                      <Phone size={15} className="text-gray-500" />
                      {companyData?.companies_information.contact_no}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-gray-500">Address</Label>
                    <p className="flex items-center gap-2">
                      <MapPin size={15} className="text-gray-500" />
                      {companyData?.companies_information.address}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-gray-500">Industry</Label>
                    <p className="flex items-center gap-2">
                      <Briefcase size={15} className="text-gray-500" />
                      {companyData?.companies_information.industry.name}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => prepareModalData("industry")}
                        className="ml-2 h-7 px-2 text-xs text-lochmara hover:text-lochmara hover:bg-lochmara-500/10"
                      >
                        <PencilLine size={14} className="mr-1" /> Change
                      </Button>
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-gray-500">Description</Label>
                  <p className="mt-2 text-sm flex items-start gap-2">
                    <FileText size={15} className="text-gray-500 mt-0.5 flex-shrink-0" />
                    <span>{companyData?.companies_information.description}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Account Settings */}
        <div className="md:col-span-1">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-500">Account Email</Label>
                <p>{companyData?.email}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => prepareModalData("accountEmail")}
                  className="w-full mt-2 text-lochmara border-lochmara hover:bg-lochmara-500 hover:text-white"
                >
                  Update Email
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-500">Password</Label>
                <p>••••••••••</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => prepareModalData("password")}
                  className="w-full mt-2 text-lochmara border-lochmara hover:bg-lochmara-500 hover:text-white"
                >
                  Change Password
                </Button>
              </div>
            </CardContent>
            
            <CardFooter className="border-t pt-6">
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => setCurrentModal("delete")}
              >
                Delete Company
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Update Company Information Modal */}
      <Dialog open={currentModal === "companyInfo"} onOpenChange={(open) => !open && setCurrentModal(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Update Company Information</DialogTitle>
            <DialogDescription>
              Make changes to your company profile information here.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(updateCompanyInfo)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name" className="mb-1.5">Company Name</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Company name is required" })}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message as string}</p>}
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="address" className="mb-1.5">Address</Label>
                <Input
                  id="address"
                  {...register("address", { required: "Address is required" })}
                />
                {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message as string}</p>}
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="description" className="mb-1.5">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  {...register("description", { required: "Description is required" })}
                />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message as string}</p>}
              </div>
              
              <div>
                <Label htmlFor="companyEmail" className="mb-1.5">Company Email</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  {...register("companyEmail", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                {errors.companyEmail && <p className="text-sm text-red-500 mt-1">{errors.companyEmail.message as string}</p>}
              </div>
              
              <div>
                <Label htmlFor="contactNo" className="mb-1.5">Contact Number</Label>
                <Input
                  id="contactNo"
                  {...register("contactNo", { 
                    required: "Contact number is required",
                    pattern: {
                      value: /^[0-9]{11}$/,
                      message: "Please enter a valid 11-digit number"
                    }
                  })}
                />
                {errors.contactNo && <p className="text-sm text-red-500 mt-1">{errors.contactNo.message as string}</p>}
              </div>
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setCurrentModal(null)}>Cancel</Button>
              <Button 
                type="submit" 
                className="bg-lochmara-500 hover:bg-lochmara-500/90"
                disabled={updating}
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : "Update Information"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Update Industry Modal */}
      <Dialog open={currentModal === "industry"} onOpenChange={(open) => !open && setCurrentModal(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Company Industry</DialogTitle>
            <DialogDescription>
              Select the industry that best represents your company.
            </DialogDescription>
          </DialogHeader>
          
          <form id="industryForm" onSubmit={handleSubmit(updateIndustry)} className="space-y-4 py-4">
            <div>
              <Label htmlFor="industry" className="mb-1.5">Industry</Label>
              <Controller
                name="industry"
                control={control}
                defaultValue={companyData?.companies_information?.industry?.name || ""}
                rules={{ required: "Please select an industry" }}
                render={({ field }) => (
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleIndustryChange(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Industries</SelectLabel>
                        {industries.map((industry) => (
                          <SelectItem key={industry.id} value={industry.name}>
                            {industry.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.industry && <p className="text-sm text-red-500 mt-1">{errors.industry.message as string}</p>}
              
              {isOtherSelected && (
                <div className="mt-3">
                  <Input
                    placeholder="Specify your industry"
                    {...register("otherIndustry", { 
                      required: isOtherSelected ? "Please specify your industry" : false 
                    })}
                  />
                  {errors.otherIndustry && <p className="text-sm text-red-500 mt-1">{errors.otherIndustry.message as string}</p>}
                </div>
              )}
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setCurrentModal(null)}>Cancel</Button>
              <Button 
                type="submit" 
                className="bg-lochmara-500 hover:bg-lochmara-500/90"
                disabled={updating}
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : "Save Industry"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Update Logo Modal */}
      <Dialog open={currentModal === "logo"} onOpenChange={(open) => !open && setCurrentModal(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Company Logo</DialogTitle>
            <DialogDescription>
              Upload a new logo for your company profile.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid place-items-center gap-5">
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-gray-200">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <img src={companyData?.logoUrl} alt="Current logo" className="w-full h-full object-cover" />
                )}
              </div>
              
              <div className="w-full">
                <Label htmlFor="logo" className="mb-1.5">Select Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: Square image, max 10MB</p>
              </div>
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => {
                setCurrentModal(null);
                setSelectedFile(null);
                setPreviewUrl(null);
              }}>
                Cancel
              </Button>
              <Button 
                type="button" 
                className="bg-lochmara-500 hover:bg-lochmara-500/90"
                disabled={updating || !selectedFile}
                onClick={updateLogo}
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : "Upload Logo"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Account Email Modal */}
      <Dialog open={currentModal === "accountEmail"} onOpenChange={(open) => !open && setCurrentModal(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Account Email</DialogTitle>
            <DialogDescription>
              Change the email address used to log in to your account.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(updateAccountEmail)} className="space-y-4 py-4">
            <div>
              <Label className="mb-1.5">Current Email</Label>
              <p className="text-gray-700">{companyData?.email}</p>
            </div>
            
            <div>
              <Label htmlFor="email" className="mb-1.5">New Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message as string}</p>}
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setCurrentModal(null)}>Cancel</Button>
              <Button 
                type="submit" 
                className="bg-lochmara-500 hover:bg-lochmara-500/90"
                disabled={updating}
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : "Update Email"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Update Password Modal */}
      <Dialog open={currentModal === "password"} onOpenChange={(open) => !open && setCurrentModal(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Update your account password here.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(updatePassword)} className="space-y-4 py-4">
            <div>
              <Label htmlFor="currentPassword" className="mb-1.5">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                {...register("currentPassword", { required: "Current password is required" })}
              />
              {errors.currentPassword && <p className="text-sm text-red-500 mt-1">{errors.currentPassword.message as string}</p>}
            </div>
            
            <div>
              <Label htmlFor="newPassword" className="mb-1.5">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                {...register("newPassword", { 
                  required: "New password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters long" }
                })}
              />
              {errors.newPassword && <p className="text-sm text-red-500 mt-1">{errors.newPassword.message as string}</p>}
            </div>
            
            <div>
              <Label htmlFor="confirmPassword" className="mb-1.5">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", { 
                  required: "Please confirm your password",
                  validate: value => value === watch('newPassword') || "Passwords don't match"
                })}
              />
              {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message as string}</p>}
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setCurrentModal(null)}>Cancel</Button>
              <Button 
                type="submit" 
                className="bg-lochmara-500 hover:bg-lochmara-500/90"
                disabled={updating}
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : "Change Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Company Modal */}
      <Dialog open={currentModal === "delete"} onOpenChange={(open) => !open && setCurrentModal(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Company Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All data associated with this company will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="font-medium">Are you sure you want to delete {companyData?.companies_information.name}?</p>
            <p className="text-sm text-gray-500 mt-2">Please type <span className="font-semibold">DELETE</span> to confirm</p>
            <Input 
              className="mt-3" 
              placeholder="Type DELETE to confirm"
              {...register("confirmDelete", { 
                validate: value => value === "DELETE" || "Please type DELETE to confirm" 
              })}
            />
            {errors.confirmDelete && <p className="text-sm text-red-500 mt-1">{errors.confirmDelete.message as string}</p>}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCurrentModal(null)}>Cancel</Button>
            <Button 
              type="button"
              variant="destructive"
              disabled={updating || watch('confirmDelete') !== 'DELETE'}
              onClick={deleteCompanyAccount}
            >
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : "Permanently Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileEmployer;