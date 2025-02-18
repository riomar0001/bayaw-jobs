import AccountHead from "@/components/customs/applicant/AccountHead"
import ActivePositions from "@/components/customs/applicant/ActivePositions"
import AllExperiences from "@/components/customs/applicant/AllExperiences"
import AllPersonalInfo from "@/components/customs/applicant/AllPersonalInfo"
import CareerStatus from "@/components/customs/applicant/CareerStatus"
import Education from "@/components/customs/applicant/Education"
import Resume from "@/components/customs/applicant/Resume"

const Profile = () => {
    return (
        <div className="bg-neutral-100 flex">

            <div className="space-y-8">
                <AccountHead />
                <AllPersonalInfo />
                <Resume />
                <AllExperiences />
                <Education />
            </div>

            <div className="space-y-8">
                <ActivePositions />
                <CareerStatus />
            </div>


        </div>
    )
}

export default Profile
