import AccountHead from "@/components/customs/applicant/AccountHead"
import ActivePositions from "@/components/customs/applicant/ActivePositions"
import AllExperiences from "@/components/customs/applicant/AllExperiences"
import AllPersonalInfo from "@/components/customs/applicant/AllPersonalInfo"
import CareerStatus from "@/components/customs/applicant/CareerStatus"
import Education from "@/components/customs/applicant/Education"
import PersonalInformations from "@/components/customs/applicant/PersonalInformations"
import Resume from "@/components/customs/applicant/Resume"
import ResumeSmall from "@/components/customs/applicant/ResumeSmall"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/authContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Profile = () => {
    const navigate = useNavigate();
    const { authStateApplicant } = useAuth();



    

    useEffect(() => {

        if (authStateApplicant?.authenticated === false) {
            navigate("/login")
        }

        if (authStateApplicant?.done_onboarding === false) {
            navigate("/")
        }

    }, [authStateApplicant, navigate])



    return (
        <div className="bg-neutral-100 flex justify-center gap-x-5 px-24 py-12">
            <div className="space-y-5">
                <AccountHead />
                <AllPersonalInfo />
                <Resume />
                <AllExperiences />
                <Education />
            </div>

            <div className="space-y-5">
                <ActivePositions />
                <CareerStatus />
                <PersonalInformations />
                <ResumeSmall />
            </div>

        </div>
    )
}

export default Profile
