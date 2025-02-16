import AccountRegistration from "@/components/customs/landing/sections/AccountRegistration";
import DiscoverCareer from "@/components/customs/landing/sections/DiscoverCareer";
import Hero from "@/components/customs/landing/sections/Hero";
import JobsPick from "@/components/customs/landing/sections/JobsPick";
import LatestJobs from "@/components/customs/landing/sections/LatestJobs";
import TrustCompanies from "@/components/customs/landing/sections/TrustCompanies";
import WhyUs from "@/components/customs/landing/sections/WhyUs";

const Landing = () => {
    return (
        <div className="bg-neutral-100">
            <Hero />
            <TrustCompanies />
            <JobsPick/>
            <LatestJobs/>
            <WhyUs/>
            <AccountRegistration/>
            <DiscoverCareer/>
        </div>
    );
};

export default Landing;
