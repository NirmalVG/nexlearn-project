import Image from "next/image"
import AuthDetails from "@/components/AuthDetails/AuthDetails"

export default function LoginPage() {
  return (
    <section className="min-h-screen w-full bg-[url('/images/background.webp')] bg-cover bg-center bg-no-repeat flex justify-center items-center p-4">
      <div className="w-full max-w-md lg:w-[866px] lg:max-w-none bg-linear-to-t from-[#2a4a63] via-[#20384a] to-[#1c3141] rounded-2xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 p-6">
        <div className="flex flex-col justify-center lg:justify-around items-center gap-8">
          <Image
            src="/images/login-logo.webp"
            height={83}
            width={265}
            alt="logo"
            priority
          />

          <Image
            className="hidden lg:block"
            src="/images/illustration.webp"
            height={260}
            width={336}
            alt="illustration"
          />
        </div>

        <div className="bg-white rounded-xl p-6 lg:p-8 h-full flex flex-col">
          <AuthDetails />
        </div>
      </div>
    </section>
  )
}
