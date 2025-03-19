import { Input } from '@/components/ui/input'
import { Mail, Smartphone, User } from 'lucide-react'
import { useEffect } from "react"
import { useAuth } from "@/contexts/authContext"
import { useNavigate } from "react-router-dom"

const EditProfile = () => {



    const navigate = useNavigate();
    const { authStateApplicant } = useAuth();

    useEffect(() => {
        if (authStateApplicant?.authenticated === false) {
            navigate("/login")
        }
    }, [authStateApplicant])
    return (
        <div className="bg-neutral-100 flex justify-center gap-x-5 px-24 py-12">
            <div className="bg-white border border-neutral-100 w-[1000px] h-auto rounded-lg px-12 py-6">
                <h1 className="font-semibold text-xl mb-6">Edit your information</h1>

                <div className="flex justify-between">
                    <section>
                        <h1 className="text-sm font-normal">First Name</h1>
                        <div className="relative mb-4">
                            <User color="black" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                            <Input placeholder="Edit your first name" className="bg-neutral-100 h-12 w-full pl-12" />
                        </div>
                    </section>

                    <section>
                        <h1 className="text-sm font-normal">Last Name</h1>
                        <div className="relative mb-4">
                            <User color="black" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                            <Input placeholder="Edit your last name" className="bg-neutral-100 h-12 w-full pl-12" />
                        </div>
                    </section>
                </div>

                <section>
                    <h1 className="text-sm font-normal">Email</h1>
                    <div className="relative mb-4">
                        <Mail color="black" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                        <Input placeholder="Edit your email" className="bg-neutral-100 h-12 pl-12" />
                    </div>
                </section>
                <section>
                    <h1 className="text-sm font-normal">Phone Number</h1>
                    <div className="relative mb-4">
                        <Smartphone color="black" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                        <Input placeholder="Edit your email" className="bg-neutral-100 h-12 pl-12" />
                    </div>
                </section>
                <section>
                    <h1 className="text-sm font-normal">Birthdate</h1>
                    <div className="relative mb-4">
                        <Smartphone color="black" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                        <Input placeholder="Edit your email" className="bg-neutral-100 h-12 pl-12" />
                    </div>
                </section>

            </div>
        </div>

    )
}

export default EditProfile