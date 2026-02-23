import { BusinessProfile } from "@/types/business";

export const mockBusiness: BusinessProfile = {
  id: "1",
  name: "Bayaw Technologies",
  logo: "/company/bayaw-logo.png",
  description:
    "Bayaw Technologies is a leading software development company specializing in building innovative digital solutions. We focus on creating cutting-edge web and mobile applications that help businesses transform and grow in the digital age. Our team of passionate engineers, designers, and product managers work together to deliver exceptional results for our clients.",
  industry: "Technology",
  companySize: "51-200",
  foundedYear: 2018,
  website: "https://bayaw.com",
  socialLinks: {
    linkedin: "https://linkedin.com/company/bayaw",
    twitter: "https://twitter.com/bayawtech",
    facebook: "https://facebook.com/bayawtech",
    instagram: "https://instagram.com/bayawtech",
  },
  locations: [
    {
      id: "1",
      address: "123 Tech Street, Floor 5",
      city: "Istanbul",
      state: "Marmara",
      country: "Turkey",
      postalCode: "34000",
      isHeadquarters: true,
    },
    {
      id: "2",
      address: "456 Innovation Avenue",
      city: "Ankara",
      country: "Turkey",
      postalCode: "06000",
      isHeadquarters: false,
    },
    {
      id: "3",
      address: "789 Digital Boulevard, Suite 200",
      city: "San Francisco",
      state: "California",
      country: "USA",
      postalCode: "94102",
      isHeadquarters: false,
    },
  ],
  contactEmail: "careers@bayaw.com",
  contactPhone: "+90 (212) 555 0000",
};

export const getBusinessProfile = (): BusinessProfile => {
  return mockBusiness;
};
