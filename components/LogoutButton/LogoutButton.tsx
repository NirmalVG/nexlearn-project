"use client"

import { signOut } from "next-auth/react"
import { useAppDispatch } from "@/redux/hooks"
import { logoutUser } from "@/redux/slices/authSlice"

const LogoutButton = () => {
  const dispatch = useAppDispatch()

  const handleLogout = async () => {
    await dispatch(logoutUser())

    await signOut({ callbackUrl: "/" })
  }

  return (
    <button
      onClick={handleLogout}
      className="absolute cursor-pointer top-1/2 right-4 -translate-y-1/2 px-5 py-3 bg-[#177a9c] text-white rounded-lg"
    >
      Logout
    </button>
  )
}

export default LogoutButton
