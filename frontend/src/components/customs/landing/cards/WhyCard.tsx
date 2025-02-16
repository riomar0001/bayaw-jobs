const WhyCard = ({ label, children }: WhyCardProps) => {
    return (
        <div className="w-[450px] h-40 bg-white border border-neutral-200 rounded-xl flex flex-col justify-center items-center space-y-3 px-8">
            <div className="bg-neutral-100 w-12 h-12 flex justify-center items-center rounded-full">
                {children}
            </div>

            <h1 className="text-lg text-stone-800 font-medium text-center">
                {label}
            </h1>
        </div>
    );
};

export default WhyCard;
