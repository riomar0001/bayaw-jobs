import JobCard from "@/components/customs/employer/cards/JobCard"
import { DashboardJobsSample } from "@/constants"

const Dashboard = () => {
  return (
    <div className="p-12">
      <h1 className="text-3xl">Dashboard</h1>

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
            date={item.date} />
        ))}

      </div>

    </div>
  )
}

export default Dashboard