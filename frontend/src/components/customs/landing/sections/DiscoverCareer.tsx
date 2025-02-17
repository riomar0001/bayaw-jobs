import { Button } from "@/components/ui/button";
import { images } from "@/constants";

const DiscoverCareer = () => {
    return (
        <div className="bg-lochmara-500 relative w-full h-[500px] px-24 flex flex-col justify-center items-center">
            <img
                src={images.union}
                className="absolute inset-0 w-full h-full object-cover opacity-90"
                style={{ transform: "scale(0.95)" }}
            />

            <div className="relative text-center space-y-3">
                <h1 className="text-white text-lg font-light">#1 JOB PORTAL</h1>
                <h1 className="text-white text-6xl font-medium px-36">Discover Your Next Career Move with Ease</h1>
            </div>

            <div className="relative flex justify-center space-x-3 mt-14">
                <Button className="bg-white text-lochmara-500 h-12 hover:bg-neutral-400 hover:text-white">
                    Start job search
                </Button>
                <Button className="bg-transparent border border-white text-white h-12 hover:bg-white hover:text-lochmara-500">
                    Learn More
                </Button>
            </div>
        </div>
    );
};

export default DiscoverCareer;
