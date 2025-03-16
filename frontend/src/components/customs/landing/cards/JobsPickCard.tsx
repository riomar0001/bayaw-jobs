import { FaChartPie, FaSuitcase } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { AiFillDollarCircle } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { BiSolidBuilding } from "react-icons/bi";

const JobsPickCard = ({
  jobtitle,
  company,
  type,
  companystatus,
  location,
  salary,
  category,
  timestamp,
  image,
}: JobsPickCardProps) => {
  return (
    <div className="w-[430px] h-auto bg-white border border-neutral-200 rounded-xl flex flex-col justify-start items-start space-y-6 px-8 py-6 hover:border-lochmara-500 cursor-pointer">
      <div className="flex gap-4 items-center">

        <img src={image} className="w-12 h-12 rounded-full object-cover" />
        <div className="flex flex-col flex-grow">
          <h1 className="text-lg text-stone-800 font-medium">{jobtitle}</h1>
          <p className="text-sm text-neutral-500">{company}</p>
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
        <p className="text-xs text-lochmara-500 pt-3">{timestamp}</p>
        <Button className="bg-lochmara-500 h-10 hover:bg-lochmara-500/90">Job Details</Button>
      </div>
    </div>
  );
};

export default JobsPickCard;
