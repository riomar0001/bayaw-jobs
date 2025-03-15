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
  category: string[];
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

