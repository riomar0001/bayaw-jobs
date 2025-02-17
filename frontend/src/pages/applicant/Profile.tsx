import AccountHead from "@/components/customs/applicant/AccountHead"
import AllPersonalInfo from "@/components/customs/applicant/AllPersonalInfo"
import Resume from "@/components/customs/applicant/Resume"

const Profile = () => {
    return (
        <div className="bg-neutral-100">

            <div className="space-y-8">
                <AccountHead />
                <AllPersonalInfo />
                <Resume />
            </div>


        </div>
    )
}

export default Profile
