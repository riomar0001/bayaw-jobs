import { Button } from "@/components/ui/button";
import { ActivePositionsSample } from "@/constants";
import { ChevronRight } from "lucide-react";

const getStatusStyle = (status: any) => {
    return (
        status === "Interview" ? "bg-tussock-100 text-tussock-500" : 
        status === "Invited" ? "bg-lochmara-100 text-lochmara-500" : 
        status === "Rejected" ? "bg-thunderbird-100 text-thunderbird-500" : ""
    );
    
};

const ActivePositions = () => {
    return (
        <div className="bg-white border border-neutral-100 w-[380px] h-auto rounded-lg p-6">
            <h1 className="text-lg font-medium">Active Positions</h1>

            {ActivePositionsSample.slice(0, 2).map((sample) => (
                <section className="my-3" key={sample.id}>
                    <img
                        src={sample.companyImage}
                        className="w-10 h-10 rounded-full object-cover"
                        alt={sample.company}
                    />

                    <div className="flex items-center justify-between my-2">
                        <div className="-space-y-1">
                            <h1 className="text-base font-medium text-black">{sample.role}</h1>
                            <h1 className="text-base font-normal text-neutral-500">
                                {sample.company}
                            </h1>
                        </div>

                        <div
                            className={`py-2 px-4 w-fit rounded-md ${getStatusStyle(sample.status)}`}>
                            <h1 className="font-medium text-sm">{sample.status}</h1>
                        </div>
                    </div>

                    {sample.id !== ActivePositionsSample.slice(0, 2)[ActivePositionsSample.slice(0, 2).length - 1].id && <hr />}
                </section>
            ))}

            <Button className="bg-lochmara-500 text-white w-full rounded-full hover:bg-lochmara-500/80 my-3">Show All <ChevronRight/> </Button>

        </div>
    );
};

export default ActivePositions;
