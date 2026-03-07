export interface BusinessProfile {
  id: string;
  company_name: string;
  logo?: string;
  about: string;
  industry: string;
  company_size: CompanySize;
  foundation_year: number;
  website?: string;
  social_links: SocialLinks;
  locations: BusinessLocation[];
  contact: BusinessContact;
}

export interface BusinessContact {
  email: string;
  phone?: string;
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
  postal_code?: string;
  is_headquarter: boolean;
}
