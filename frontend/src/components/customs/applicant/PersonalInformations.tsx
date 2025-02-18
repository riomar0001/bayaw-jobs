import { MailSearch, Smartphone } from "lucide-react"

const PersonalInformations = () => {
    return (
        <div className="bg-white border border-neutral-300 w-[380px] h-auto rounded-lg p-6">
            <h1 className="text-lg font-medium mb-3">Personal Informations</h1>

            <div className="flex items-center gap-x-5">
                <section className="bg-neutral-100 w-10 h-10 rounded-lg flex justify-center items-center">
                    <Smartphone className="text-neutral-500" size={20} />
                </section>
                <section>
                    <h1 className="font-medium text-base text-black">+63 998 765 4321</h1>
                    <h1 className="font-normal text-sm text-neutral-500">Philippine Number</h1>
                </section>
            </div>

            <hr className="my-5" />

            <div className="flex items-center gap-x-5">
                <section className="bg-neutral-100 w-10 h-10 rounded-lg flex justify-center items-center">
                    <MailSearch className="text-neutral-500" size={20} />
                </section>
                <section>
                    <h1 className="font-medium text-black text-base">jerome.bell@example.com</h1>
                    <h1 className="font-normal text-neutral-500 text-sm">Mail Address</h1>
                </section>
            </div>



        </div>
    )
}

export default PersonalInformations