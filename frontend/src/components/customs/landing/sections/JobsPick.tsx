import JobsPickCard from "../cards/JobsPickCard";

const JobsPickItems = [
    {
        id: 1,
        jobtitle: "Mobile App Developer",
        company: "Xiaomi",
        type: "Smartphones/Electronics",
        companystatus: "Listed Company",
        location: "Beijing",
        salary: "15-25k",
        category: ["Fortune", "Innovation Hub", "Global Presence"],
        timestamp: "4 Days Ago"
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
        timestamp: "1 Week Ago"
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
        timestamp: "14 June 2024"
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
        timestamp: "7 July 2024"
    },
    
];

const JobsPick = () => {
    return (
        <div className="w-full h-auto flex flex-col items-center justify-center px-24">
            <h1 className="text-4xl font-medium text-center mb-8">Jobs picks for you</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {JobsPickItems.map((item) => {
                    return (
                        <JobsPickCard
                            key={item.id}
                            jobtitle={item.jobtitle}
                            company={item.company}
                            type={item.type}
                            companystatus={item.companystatus}
                            location={item.location}
                            salary={item.salary}
                            category={item.category}
                            timestamp={item.timestamp}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default JobsPick;