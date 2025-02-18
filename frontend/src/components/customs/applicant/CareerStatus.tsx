import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CareerStatus = () => {
    return (
        <div className="bg-white border border-neutral-300 w-[380px] h-auto rounded-lg p-6">
            <h1 className="text-lg font-medium mb-3">Career Status</h1>

                <Select>
                    <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Select career status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="active">Actively Seeking Job</SelectItem>
                            <SelectItem value="employed">Employed</SelectItem>
                            <SelectItem value="unemployed">Unemployed</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="freelancer">Freelancer</SelectItem>
                            <SelectItem value="retired">Retired</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
        </div>
    )
}

export default CareerStatus