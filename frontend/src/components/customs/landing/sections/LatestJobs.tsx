import { LatestJobItems } from "@/constants";
import LatestJobCard from "../cards/LatestJobCard";
// import { useState, useEffect } from "react";
// import axios from "axios"

// interface LatestJobsTypes {
//     id: string,
//     company: string,

// }

const JobsPick = () => {
  //   const [latestJobs, setLatestJobs] = useState([]);

  //   useEffect(() => {
  //     // Fetch jobs from the API
  //     const fetchJobs = async () => {
  //     //   setLoading(true);
  //       try {
  //         const response = await axios.get("/api/jobs/all/recent");
  //         console.log("RECENT JOBS", response.data);

  //         setLatestJobs(response.data);
  //       } catch (error) {
  //         console.error("Error fetching jobs:", error);
  //       } finally {
  //         // setLoading(false);
  //       }
  //     };
  //     fetchJobs();
  //   }, []);

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center px-24 pt-12 pb-24">
      <h1 className="text-4xl font-medium text-center mb-8">
        Latest job opportunities
      </h1>
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-auto">
          {LatestJobItems.map((item) => {
            return (
              <LatestJobCard
                key={item.id}
                company={item.company}
                jobquantity={item.jobquantity}
                category={item.category}
                image={item.image}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JobsPick;
