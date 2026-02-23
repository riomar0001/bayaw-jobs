export interface BusinessProfile {
  id: string;
  name: string;
  logo?: string;
  description: string;
  industry: string;
  companySize: CompanySize;
  foundedYear: number;
  website?: string;
  socialLinks: SocialLinks;
  locations: BusinessLocation[];
  contactEmail: string;
  contactPhone?: string;
}

export type CompanySize =
  | "1-10"
  | "11-50"
  | "51-200"
  | "201-500"
  | "501-1000"
  | "1000+";

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

export interface BusinessLocation {
  id: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  isHeadquarters: boolean;
}
