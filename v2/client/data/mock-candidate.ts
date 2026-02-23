import { Candidate } from "@/types/candidate";

export const mockCandidate: Candidate = {
  id: "1",
  firstName: "Jerome",
  lastName: "Bell",
  fullName: "Jerome Bell",
  age: 24,
  title: "Senior Software Developer",
  company: "Coderspace",
  profilePhoto: "/avatars/jerome.jpg",
  linkedInUrl: "https://linkedin.com/in/jeromebell",

  personalInfo: {
    email: "jerome.bell@example.com",
    phone: "+90 (545) 493 00 00",
    countryCode: "Turkey",
    dateOfBirth: "03 September 2000",
    age: 18,
    salaryExpectation: 24000,
    currency: "$",
    locations: ["Istanbul", "Izmir", "Ankara", "Turkey", "US", "Europe"],
    workTypes: ["Remote", "Fulltime", "Part-Time", "Internship", "Freelance"],
  },

  resume: {
    fileName: "jerome-bell-resume.pdf",
    fileUrl: "/resumes/jerome-bell-resume.pdf",
    uploadedAt: "2024-01-15",
  },

  experiences: [
    {
      id: "1",
      companyName: "Trendyol.com",
      companyLogo: "/companies/trendyol.png",
      position: "Front-End Developer",
      employmentType: "Fulltime",
      duration: "1 Year 2 Months",
      startDate: "Oct 2021",
      endDate: "Dec 2022",
    },
    {
      id: "2",
      companyName: "TiklaGelsin",
      companyLogo: "/companies/tiklagelsin.png",
      position: "Front-End Developer",
      employmentType: "Contract",
      duration: "1 Year 2 Months",
      startDate: "Oct 2021",
      endDate: "Dec 2022",
    },
    {
      id: "3",
      companyName: "Pazarama",
      companyLogo: "/companies/pazarama.png",
      position: "Front-End Developer",
      employmentType: "Internship",
      duration: "1 Year",
      startDate: "Oct 2021",
      endDate: "Oct 2022",
    },
  ],

  education: [
    {
      id: "1",
      institutionName: "Middle Earth Technic University",
      institutionLogo: "/universities/metu.png",
      degree: "Master degree in Computer science and Mathemetics",
      date: "January, 2012",
      location: "Istanbul, Turkey",
    },
    {
      id: "2",
      institutionName: "Bogazici Technic University",
      institutionLogo: "/universities/bogazici.png",
      degree: "Master degree in Computer science and Mathemetics",
      date: "January, 2012",
      location: "Istanbul, Turkey",
    },
  ],

  preferredPositions: [
    {
      id: "1",
      name: "Front-End Dev. (C#)",
      yearsExperience: 2,
      isSelected: true,
    },
    {
      id: "2",
      name: "Back-End Dev. (React)",
      yearsExperience: 1,
      isSelected: true,
    },
    {
      id: "3",
      name: "Backend Developer (NodeJS)",
      yearsExperience: 3,
      isSelected: true,
    },
  ],

  skills: [
    { id: "1", name: "Mobile Application" },
    { id: "2", name: "Problem-Solving" },
    { id: "3", name: "Team-Working" },
    { id: "4", name: "PHP" },
    { id: "5", name: "Javascript" },
    { id: "6", name: "HTML / CSS" },
    { id: "7", name: "SwiftUI" },
  ],

  languages: [
    {
      id: "1",
      code: "TR",
      name: "Turkish",
      proficiency: "Native Language",
    },
    {
      id: "2",
      code: "EN",
      name: "English",
      proficiency: "Advanced",
    },
    {
      id: "3",
      code: "DE",
      name: "German",
      proficiency: "Intermediate",
    },
  ],

  activePositions: [
    {
      id: "1",
      jobTitle: "Front-End Developer",
      companyName: "Trendyol Inch.",
      companyLogo: "/companies/trendyol.png",
      status: "Interview",
    },
    {
      id: "2",
      jobTitle: "Sr. Front-End Developer",
      companyName: "Anadolu Sigorta",
      companyLogo: "/companies/anadolu.png",
      status: "Invited",
    },
  ],

  careerStatus: "actively-seeking",
};
