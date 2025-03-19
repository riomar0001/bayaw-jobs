import { FileUser, Mail, Phone } from 'lucide-react'

interface ApplicantsCardProps {
    name: string;
    email: string;
    contactNumber: string;
    applicantId: string;
}

const ApplicantsCard = ({ name, email, contactNumber, applicantId }: ApplicantsCardProps) => {
    return (
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-100 cursor-pointer">
            <div>
                <h1 className="text-2xl font-semibold mb-2">{name} </h1>
                <div className="flex items-center space-x-2">
                    <Mail size={15} />
                    <h1 className="text-sm font-light">{email} </h1>
                </div>
                <div className="flex items-center space-x-2">
                    <Phone size={15} />
                    <h1 className="text-sm font-light">{contactNumber} </h1>
                </div>
                <div className="flex items-center space-x-2">
                    <FileUser size={15} />
                    <h1 className="text-sm font-light">CV/Resume</h1>
                </div>
            </div>
        </div>
    )
}

export default ApplicantsCard