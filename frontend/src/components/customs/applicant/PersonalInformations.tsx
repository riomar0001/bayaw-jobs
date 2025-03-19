import { FaFacebook, FaTwitter } from "react-icons/fa"

interface PersonalInformationsProps {
    facebookURL: string;
    twitterURL: string;
}

const PersonalInformations = ({ facebookURL, twitterURL }: PersonalInformationsProps) => {
    return (
        <div className="bg-white border border-neutral-100 w-[380px] h-auto rounded-lg p-6">
            <h1 className="text-lg font-medium mb-3">Personal Informations</h1>

            <div className="flex items-center gap-x-5">
                <section className="bg-neutral-100 w-10 h-10 rounded-lg flex justify-center items-center">
                    <FaFacebook className="text-lochmara-700" size={20} />
                </section>
                <section>
                    <a
                        href={facebookURL.startsWith('http') ? facebookURL : `https://${facebookURL}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <h1 className="text-lochmara-700 text-base cursor-pointer hover:underline">{facebookURL}</h1>
                    </a>
                    <h1 className="font-normal text-neutral-500 text-sm">Facebook Account</h1>
                </section>
            </div>

            <hr className="my-5" />

            <div className="flex items-center gap-x-5">
                <section className="bg-neutral-100 w-10 h-10 rounded-lg flex justify-center items-center">
                    <FaTwitter className="text-lochmara-400" size={20} />
                </section>
                <section>
                    <a
                        href={facebookURL.startsWith('http') ? twitterURL : `https://${twitterURL}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <h1 className="text-lochmara-700 text-base cursor-pointer hover:underline">{twitterURL} </h1>
                    </a>
                    <h1 className="font-normal text-neutral-500 text-sm">Twitter Account</h1>
                </section>
            </div>



        </div>
    )
}

export default PersonalInformations