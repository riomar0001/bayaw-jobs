import sample_profile_1 from "../assets/images/sample-profile1.jpg";
import sample_profile_2 from "../assets/images/sample-profile2.jpg";
import sample_profile_3 from "../assets/images/sample-profile3.jpg";
import choose_us from "../assets/images/chooseus.png";
import union from "../assets/icons/Union.svg";

import apple from "../assets/icons/Apple.svg";
import atnt from "../assets/icons/AT&T.svg";
import mcdo from "../assets/icons/McDonalds.svg";
import meta from "../assets/icons/Meta.svg";
import sony from "../assets/icons/Sony.svg";
import brandlogo from "../assets/icons/BrandLogo.svg";

export const images = {
    sample_profile_1,
    sample_profile_2,
    sample_profile_3,
    choose_us,
    union,
};

export const logos = {
    apple,
    atnt,
    mcdo,
    meta,
    sony,
    brandlogo,
};

export const companyLogos = [
    {
        id: 1,
        image: apple,
    },
    {
        id: 2,
        image: atnt,
    },
    {
        id: 3,
        image: mcdo,
    },
    {
        id: 4,
        image: meta,
    },
    {
        id: 5,
        image: sony,
    },
];

export const JobsPickItems = [
    {
        id: 1,
        jobtitle: "Mobile App Developer",
        company: "Xiaomi",
        type: "Smartphones/Electronics",
        companystatus: "Listed Company",
        location: "Beijing",
        salary: "15-25k",
        category: ["Fortune", "Innovation Hub", "Global Presence"],
        timestamp: "4 Days Ago",
    },
    {
        id: 2,
        jobtitle: "Hardware Design Engineer",
        company: "Samsung",
        type: "Smartphones/Electronics",
        companystatus: "Listed Company",
        location: "Seoul",
        salary: "15-25k",
        category: ["Global Tech Leader", "Hardware Innovation", "Global Presence"],
        timestamp: "1 Week Ago",
    },
    {
        id: 3,
        jobtitle: "UI/UX Designer",
        company: "Framer",
        type: "Design/Technology/Software",
        companystatus: "Listed Company",
        location: "Amsterdam",
        salary: "15-25k",
        category: ["Start-up", "Creative Hub", "UI/UX Design"],
        timestamp: "14 June 2024",
    },
    {
        id: 4,
        jobtitle: "Data Scientist",
        company: "Spotify",
        type: "Music/Entertainment",
        companystatus: "Listed Company",
        location: "Stockholm",
        salary: "15-25k",
        category: ["Markey Disruptor", "Music Streaming", "Data Analytics"],
        timestamp: "7 July 2024",
    },
];

export const ExperiencesSample = [
    {
        id: 1,
        company: "Trendyol.com",
        companyImage: sample_profile_1,
        role: "Front-end Developer",
        duration: "1 Year 2 Months",
        date: "Oct 2022 - Dec 2021",
    },
    {
        id: 2,
        company: "TiklaGelsin",
        companyImage: sample_profile_2,
        role: "Front-end Developer",
        duration: "1 Year 2 Months",
        date: "Oct 2022 - Dec 2021",
    },
    {
        id: 3,
        company: "Pazarama",
        companyImage: sample_profile_3,
        role: "Front-end Developer",
        duration: "1 Year 2 Months",
        date: "Oct 2022 - Dec 2021",
    },
];

export const EducationSample = [
    {
        id: 1,
        school: "Middle Earth Technic University",
        schoolImage: sample_profile_1,
        course: "Master degree in Computer Science and Mathematics",
        date: "January, 2012",
        location: "Istanbul, Turkey",
    },
    {
        id: 2,
        school: "Bogazici Technic University",
        schoolImage: sample_profile_2,
        course: "Master degree in Computer Science and Mathematics",
        date: "January, 2012",
        location: "Istanbul, Turkey",
    },
];
