import WhyCard from "../cards/WhyCard";
import { BiSolidBarChartAlt2 } from "react-icons/bi";
import { BsStars } from "react-icons/bs";
import { FaArrowUpRightDots } from "react-icons/fa6";
import { MdPeopleAlt } from "react-icons/md";

const WhyItems = [
    {
        id: 1,
        label: "Pioneering Career Growth Through Innovative Solutions",
        icon: <FaArrowUpRightDots color="1783D0" />,
    },
    {
        id: 2,
        label: "Offering Detailed Insights into New Positions and Career Paths",
        icon: <BsStars color="1783D0" />,
    },
    {
        id: 3,
        label: "Tailored Career Solutions for Every Professional",
        icon: <MdPeopleAlt color="1783D0" />,
    },
    {
        id: 4,
        label: "Transforming Career Trajectories with Strategic Insights",
        icon: <BiSolidBarChartAlt2 color="1783D0" />,
    },
];

const WhyUs = () => {
    return (
        <div className="w-full h-auto flex flex-col items-center justify-center px-24 pt-12 pb-24">
            <h1 className="text-4xl font-medium text-center mb-8">Why choose JobTally</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {WhyItems.map((item) => (
                    <WhyCard key={item.id} label={item.label}>
                        {item.icon}
                    </WhyCard>
                ))}
            </div>
            
        </div>
    );
};

export default WhyUs;
