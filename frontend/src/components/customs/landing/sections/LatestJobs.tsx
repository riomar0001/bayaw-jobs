import { LatestJobItems } from "@/constants";
import LatestJobCard from "../cards/LatestJobCard";

const JobsPick = () => {
    return (
        <div className="w-full h-auto flex flex-col items-center justify-center px-24 pt-12 pb-24">
            <h1 className="text-4xl font-medium text-center mb-8">Latest job opportunities</h1>
            <div className="">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-auto">
                    {LatestJobItems.map((item) => {
                        return (
                            <LatestJobCard
                                key={item.id}
                                company={item.company}
                                jobquantity={item.jobquantity}
                                category={item.category}
                            />
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default JobsPick;