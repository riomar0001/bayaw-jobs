import AccountHead from "@/components/customs/applicant/AccountHead"
import AllExperiences from "@/components/customs/applicant/AllExperiences"
import AllPersonalInfo from "@/components/customs/applicant/AllPersonalInfo"
import Education from "@/components/customs/applicant/Education"
import Resume from "@/components/customs/applicant/Resume"

const Profile = () => {
    return (
        <div className="bg-neutral-100">

            <div className="space-y-8">
                <AccountHead />
                <AllPersonalInfo />
                <Resume />
                <AllExperiences />
                <Education />
            </div>


        </div>
    )
}

export default Profile
