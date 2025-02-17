import { companyLogos } from "@/constants";

const TrustCompanies = () => {
    return (
        <div className="w-full h-80 bg-[#1783D0] pt-20 space-y-8 mb-8">
            <h1 className="text-white text-2xl font-normal flex justify-center">Trusted by 100+ world's best companies</h1>

            <div className="flex flex-wrap items-center justify-center gap-x-20">
                {companyLogos.map((logo) => (
                    <div key={logo.id} className="m-2">
                        <img src={logo.image} />
                    </div>
                ))}
            </div>
            
        </div>
    );
};

export default TrustCompanies;
