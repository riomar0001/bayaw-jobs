import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Briefcase, Building, Clock, DollarSign, MapPin, UserRoundPen } from "lucide-react"


const JobDetailsCard = ({ position, status, company, category, location, minSalary, maxSalary, schedule, description, image }: JobDetailsCardProps) => {
    return (
        <section className="flex-1">
            <Card className="border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="border-b border-neutral-100 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img
                                src={image}
                                className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover border border-neutral-200 shadow-sm"
                                alt="Company logo"
                            />
                            <Badge className="absolute -top-2 -right-2 bg-green-500 hover:bg-green-600">{status} </Badge>
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800">{position} </h1>
                            <div className="flex items-center gap-2 text-neutral-500">
                                <Building size={16} className="text-lochmara-400" />
                                <span className="font-medium">{company} </span>
                                <span className="text-xs text-neutral-400">• Posted yesterday</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-8">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 bg-lochmara-50 p-2 rounded-lg">
                                <Briefcase size={18} className="text-lochmara-500" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-700">Job Category</h2>
                                <p className="text-neutral-600">{category} </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-1 bg-lochmara-50 p-2 rounded-lg">
                                <MapPin size={18} className="text-lochmara-500" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-700">Location</h2>
                                <p className="text-neutral-600">{location} </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-1 bg-lochmara-50 p-2 rounded-lg">
                                <DollarSign size={18} className="text-lochmara-500" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-700">Salary Range</h2>
                                <p className="text-neutral-600">₱{minSalary} - ₱{maxSalary} </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-1 bg-lochmara-50 p-2 rounded-lg">
                                <Clock size={18} className="text-lochmara-500" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-700">Work Schedule</h2>
                                <p className="text-neutral-600">{schedule} </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-2 border-b border-neutral-100 pb-2">Job Description</h2>
                            <p className="text-neutral-600">{description} </p>
                        </div>

                        <div className="pt-4">
                            <div className="flex items-center gap-2 mb-2">
                                <UserRoundPen size={18} className="text-lochmara-500" />
                                <h2 className="text-md font-semibold text-gray-700">Applicants</h2>
                            </div>
                            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                                <div className="flex justify-between items-center">
                                    <h1>No Applicants Found</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                </CardContent>
            </Card>
        </section>
    )
}

export default JobDetailsCard