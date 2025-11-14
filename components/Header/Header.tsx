import Image from "next/image"
import LogoutButton from "../LogoutButton/LogoutButton"
import Link from "next/link"

export default function Header() {
  return (
    <section className="relative h-[90px] bg-[#ffffff]">
      <div
        className="absolute top-1/2 -translate-y-1/2 
                  left-4 translate-x-0                
                  md:left-1/2 md:-translate-x-1/2 cursor-pointer"
      >
        <Link href="/">
          <Image src="/images/logo.webp" alt="logo" width={191} height={60} />
        </Link>
      </div>
      <div>
        <LogoutButton />
      </div>
    </section>
  )
}
