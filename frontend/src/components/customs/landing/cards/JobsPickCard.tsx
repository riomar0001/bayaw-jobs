import { images } from "@/constants";
import { FaChartPie, FaSuitcase } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { AiFillDollarCircle } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { CiBookmark } from "react-icons/ci";
import { BiSolidBuilding } from "react-icons/bi";

const JobsPickCard: React.FC<JobsPickCardProps> = ({
  jobtitle,
  company,
  type,
  companystatus,
  location,
  salary,
  category,
  timestamp,
}) => {
  return (
    <div className="w-[450px] h-auto bg-white border border-neutral-200 rounded-xl flex flex-col justify-start items-start space-y-6 px-8 py-6">
      <div className="flex gap-4 items-center">
        <img src={images.sample_profile_1} className="w-12 h-12 rounded-full" />
        <div className="flex flex-col flex-grow">
          <h1 className="text-lg text-stone-800 font-medium">{jobtitle}</h1>
          <p className="text-sm text-neutral-500">{company}</p>
        </div>
        <div className="flex justify-end flex-grow">
          {" "}
          {/* Added flex and justify-end here */}
          <CiBookmark className="text-[#1783D0] border-neutral-500 cursor-pointer rounded-xl w-6 h-6" />
        </div>
      </div>
      <div className="flex gap-8 w-full justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <BiSolidBuilding className="text-neutral-500" />
            <p className="text-sm text-stone-800">{company}</p>
          </div>
          <div className="flex items-center gap-2">
            <FaChartPie className="text-neutral-500" />
            <p className="text-sm text-stone-800">{type}</p>
          </div>

          <div className="flex items-center gap-2">
            <FaSuitcase className="text-neutral-500" />
            <p className="text-sm text-stone-800">{companystatus}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <FaLocationDot className="text-neutral-500" />
            <p className="text-sm text-stone-800">{location}</p>
          </div>
          <div className="flex items-center gap-2">
            <AiFillDollarCircle className="text-neutral-500" />
            <p className="text-sm text-stone-800">{salary}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {category.map((cat, index) => (
          <span
            key={index}
            className="text-xs text-sky-600 bg-neutral-50 px-2 py-1 rounded-md"
          >
            {cat}
          </span>
        ))}
      </div>

      <span className="bg-neutral-200 p-[0.5px] w-full"></span>

      <div className="flex justify-between w-full">
        <p className="text-xs text-[#1783D0] pt-3">{timestamp}</p>
        <Button className="bg-[#1783D0] h-10">Job Details</Button>
      </div>
    </div>
  );
};

export default JobsPickCard;
