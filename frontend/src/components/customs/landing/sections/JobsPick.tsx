import { JobsPickItems } from "@/constants";
import JobsPickCard from "../cards/JobsPickCard";

const JobsPick = () => {
    return (
        <div className="w-full h-auto flex flex-col items-center justify-center px-24 mb-10">
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
                            image={item.image}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default JobsPick;