const LatestJobCard = ({
  company,
  jobquantity,
  category,
  image,
}: LatestJobCardProps) => {
  return (
    <div className="w-[400px] h-auto bg-white border border-neutral-200 rounded-xl flex flex-col justify-start items-start space-y-6 px-8 py-6 hover:border-lochmara-500 cursor-pointer">
      <div className="flex gap-4 items-center">

        <img src={image} className="w-12 h-12 rounded-full object-cover" />
        <div className="flex flex-col flex-grow">
          <h1 className="text-sm text-neutral-500 font-medium">Company</h1>
          <p className="text-xl text-stone-800 ">{company}</p>
        </div>

      </div>

      <span className="bg-neutral-200 p-[0.5px] w-full"></span>
      <div className="flex gap-8 w-full justify-between">

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="text-xs  text-neutral-600">Jobs available</p>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-md text-stone-800">{jobquantity} Job opportunities</p>
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



    </div>
  );
};

export default LatestJobCard;
