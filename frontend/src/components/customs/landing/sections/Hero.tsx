import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { images } from "@/constants";
import { Search } from "lucide-react";
import { FaStar } from "react-icons/fa";

const Hero = () => {
    return (
        <div className="h-screen">
            <div className="text-center space-y-6 px-24 pt-20">
                <h1 className="text-lg text-[#1783D0]">#1 Platform for Jobs</h1>
                <h1 className="text-7xl font-semibold">Find Your Dream Job That Suit With Exciting Opportunities</h1>
                <h1 className="text-xl text-neutral-500 font-light">Discover your next career move with ease</h1>
            </div>

            <div className="flex items-center justify-center mt-16 space-x-2">
                <div className="relative flex items-center w-96">
                    <Search className="absolute left-3" color="gray" size={20} />
                    <Input placeholder="Job title, Salary, or Companies" className="h-12 w-full pl-10 bg-white" />
                </div>

                <Button className="bg-[#1783D0] h-12 w-28">Search</Button>
            </div>

            <div className="flex items-center justify-center mt-16 space-x-4">
                <div className="flex -space-x-2">
                    <img src={images.sample_profile_1} className="w-12 h-12 rounded-full object-cover z-20" />
                    <img src={images.sample_profile_2} className="w-12 h-12 rounded-full object-cover z-10" />
                    <img src={images.sample_profile_3} className="w-12 h-12 rounded-full object-cover z-0" />
                </div>

                <div className="flex flex-col items-start ml-4">
                    <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, index) => (
                            <FaStar key={index} color="#FECA01" size={20} />
                        ))}
                        <h1 className="ml-2 font-medium">4.9</h1>
                    </div>
                    <h1 className="text-sm text-neutral-500">Over 100+ Reviews</h1>
                </div>
            </div>


        </div>
    );
};

export default Hero;
