import JobCard from "@/components/customs/employer/cards/JobCard"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Link } from "react-router-dom"
import axios from "axios"

const Dashboard = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  console.log(jobs);

  useEffect(() => {
    // Fetch jobs from the API
    const fetchJobs = async () => {
      setLoading(true)
      try {
        const response = await axios.get('/api/jobs/company')
        setJobs(response.data.jobs)
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  return (
    <div className="px-24 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Dashboard</h1>

        <Link to={"/employer/add-job"}>
          <Button className="bg-lochmara-500 hover:bg-lochmara-500/80">
            <Plus size={15} color="white" />
            Post New Job
          </Button>
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lochmara-500"></div>
          </div>
        ) : jobs.length > 0 ? (
          jobs.map((item, index) => (
            <JobCard
              key={index}
              data={item}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No jobs posted yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard