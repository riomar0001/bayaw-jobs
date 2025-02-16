import AccountRegistration from "@/components/landing/sections/AccountRegistration";
import DiscoverCareer from "@/components/landing/sections/DiscoverCareer";
import Hero from "@/components/landing/sections/Hero";
import JobsPick from "@/components/landing/sections/JobsPick";
import LatestJobs from "@/components/landing/sections/LatestJobs";
import TrustCompanies from "@/components/landing/sections/TrustCompanies";
import WhyUs from "@/components/landing/sections/WhyUs";

const Landing = () => {
    return (
        <div>
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
