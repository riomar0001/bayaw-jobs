import { companyLogos } from "@/constants";

const TrustCompanies = () => {
    return (
        <div className="w-full h-80 bg-[#1783D0]">
            <h1 className="text-white text-2xl font-medium">Trusted by 100+ world's best companies</h1>

            {companyLogos.map((logo) => (
                <div className="flex">
                    <img key={logo.id} src={logo.image} />
                </div>
            ))}
            
        </div>
    );
};

export default TrustCompanies;
