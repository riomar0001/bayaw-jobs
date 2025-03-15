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
}

declare interface LatestJobCardProps {
  company: string;
  jobquantity: string;
  category: string[];
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

