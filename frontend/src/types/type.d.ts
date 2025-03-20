declare interface WhyCardProps {
  label: string;
  children: any;
}

declare interface JobsPickCardProps {
  jobtitle: string;
  company: string;
  type: string;
  companystatus: string;
  location: string;
  salary: string;
  category: string;
  timestamp: string;
  image: any;
}

declare interface LatestJobCardProps {
  company: string;
  jobquantity: string;
  category: string[];
  image: any;
}



declare interface JobCardProps {
  position: string;
  description: string;
  address: string;
  category: string;
  minSalary: string;
  maxSalary: string;
  schedule: string;
  date: string;
}

declare interface CompanyProfileProps {
  companyIndustry: string;
  companyName: string;
  companyDescription: string;
  companyAddress: string;
  companyImage: any;
  email: string;
  contactNumber: string;
}

declare interface JobDetailsCardProps {
    position: string;
    status: string;
    company: string;
    category: string;
    location: string;
    minSalary: string;
    maxSalary: string;
    schedule: string;
    description: string;
    image: any;
}

declare interface EditProfileProps {
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    linkedInURL?: string;
    facebookURL?: string;
    twitterURL?: string;
    birthdate: any;
    location: string;
    profileImage?: string;
}

