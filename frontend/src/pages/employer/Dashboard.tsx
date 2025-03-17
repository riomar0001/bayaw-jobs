import JobCard from "@/components/customs/employer/cards/JobCard"
import { Button } from "@/components/ui/button"
import { DashboardJobsSample } from "@/constants"
import { Plus } from "lucide-react"
import { Link } from "react-router-dom"

const Dashboard = () => {
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
        {DashboardJobsSample.map((item, index) => (
          <JobCard
            key={index}
            position={item.position}
            description={item.description}
            address={item.address}
            category={item.category}
            minSalary={item.minSalary}
            maxSalary={item.maxSalary}
            schedule={item.schedule}
            date={item.date}
          />

        ))}

      </div>

    </div>
  )
}

export default Dashboard