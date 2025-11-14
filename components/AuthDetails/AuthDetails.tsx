"use client"

import { useState, useRef, ChangeEvent, FormEvent, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { X, Camera, Loader2 } from "lucide-react"
import MyPhoneInput from "../MyPhoneInput/MyPhoneInput"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"

import {
  sendOtp,
  verifyOtp,
  createProfile,
  resetAuthMessage,
} from "@/redux/slices/authSlice"

interface ProfileData {
  name: string
  email: string
  qualification: string
  profile_image: File | null
  preview_url: string | null
}

const AuthDetails = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const {
    authStep,
    mobile: reduxMobile,
    loading,
    error,
  } = useAppSelector((state) => state.auth)

  const [mobileInput, setMobileInput] = useState("")
  const [otp, setOtp] = useState("")
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    qualification: "",
    profile_image: null,
    preview_url: null,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      dispatch(resetAuthMessage())
    }
  }, [dispatch])

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault()

    const cleanNumber = mobileInput.replace(/\s+/g, "").replace("+", "")
    const finalMobile = "+" + cleanNumber

    if (cleanNumber.length < 10) {
      alert("Please enter a valid mobile number")
      return
    }

    dispatch(sendOtp(finalMobile))
  }

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault()

    const targetMobile =
      reduxMobile || "+" + mobileInput.replace(/\s+/g, "").replace("+", "")

    const resultAction = await dispatch(
      verifyOtp({ mobile: targetMobile, otp })
    )

    if (verifyOtp.fulfilled.match(resultAction)) {
      const payload = resultAction.payload
      if (payload.login) {
        await performNextAuthLogin(
          payload.access_token,
          payload.refresh_token,
          { mobile: targetMobile }
        )
      }
    }
  }

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()

    const targetMobile =
      reduxMobile || "+" + mobileInput.replace(/\s+/g, "").replace("+", "")

    const submissionData = {
      mobile: targetMobile,
      name: profileData.name,
      email: profileData.email,
      qualification: profileData.qualification,
      profile_image: profileData.profile_image,
    }

    const resultAction = await dispatch(createProfile(submissionData))

    if (createProfile.fulfilled.match(resultAction)) {
      const payload = resultAction.payload
      await performNextAuthLogin(
        payload.access_token,
        payload.refresh_token,
        payload.user
      )
    }
  }

  const performNextAuthLogin = async (
    accessToken?: string,
    refreshToken?: string,
    user?: any
  ) => {
    const result = await signIn("otp-login", {
      redirect: false,
      accessToken: accessToken || "",
      refreshToken: refreshToken || "",
      user: JSON.stringify(user),
    })

    if (result?.error) {
      console.error("NextAuth Error:", result.error)
    } else {
      router.push("/instructions")
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfileData({
        ...profileData,
        profile_image: file,
        preview_url: URL.createObjectURL(file),
      })
    }
  }

  return (
    <div className="flex flex-col h-full w-full">
      {error && (
        <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100 flex justify-between items-center">
          <span>{typeof error === "string" ? error : "An error occurred"}</span>
          <X
            className="w-4 h-4 cursor-pointer"
            onClick={() => dispatch(resetAuthMessage())}
          />
        </div>
      )}

      {(authStep === "INPUT_MOBILE" || !authStep) && (
        <div className="flex flex-col h-full gap-52">
          <div className="pt-2">
            <p className="text-[24px] text-bg-text mb-3 font-semibold">
              Enter your phone number
            </p>
            <p className="font-normal text-[16px] mb-6 text-bg-text/80">
              We use your mobile number to identify your account
            </p>
            <form onSubmit={handleSendOtp} className="space-y-6">
              <MyPhoneInput setMobile={setMobileInput} />

              <p className="text-xs text-slate-400">
                By tapping Get started, you agree to the{" "}
                <a href="#" className="underline hover:text-slate-600">
                  Terms & Conditions
                </a>
              </p>

              <button
                disabled={loading}
                className="w-full bg-[#1E293B] hover:bg-[#0F172A] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Get Started"}
              </button>
            </form>
          </div>
        </div>
      )}

      {authStep === "INPUT_OTP" && (
        <div className="flex flex-col h-full">
          <div className="pt-2">
            <p className="text-[24px] text-bg-text mb-3 font-semibold">
              Enter the code we texted you
            </p>
            <p className="font-normal text-[16px] mb-6 text-bg-text/80">
              We’ve sent an SMS to {reduxMobile || mobileInput}
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  SMS code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123 456"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg tracking-widest placeholder:tracking-normal"
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-400">
                  Your 6 digit code is on its way. This can sometimes take a few
                  moments to arrive.
                </p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="text-sm font-semibold text-slate-900 underline decoration-slate-900 hover:text-slate-700"
                >
                  Resend code
                </button>
              </div>

              <button
                disabled={loading}
                className="w-full bg-[#1E293B] hover:bg-[#0F172A] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Verify Code"}
              </button>
            </form>
          </div>
        </div>
      )}

      {authStep === "CREATE_PROFILE" && (
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="pt-2">
            <p className="text-[24px] text-bg-text mb-6 font-semibold">
              Add your details
            </p>

            <form onSubmit={handleRegister} className="space-y-6 pb-2">
              <div className="flex justify-center mb-6">
                <div className="relative group">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-24 h-24 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-all
                      ${
                        profileData.preview_url
                          ? "border-blue-500"
                          : "border-gray-300 hover:border-gray-400 bg-gray-50"
                      }
                    `}
                  >
                    {profileData.preview_url ? (
                      <img
                        src={profileData.preview_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2">
                        <Camera className="w-6 h-6 mx-auto text-gray-400 mb-1 group-hover:text-gray-600" />
                        <span className="text-[10px] text-gray-400 leading-tight block group-hover:text-gray-600">
                          Add Your Profile picture
                        </span>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  {profileData.preview_url && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setProfileData({
                          ...profileData,
                          profile_image: null,
                          preview_url: null,
                        })
                      }}
                      className="absolute -top-2 -right-2 bg-slate-900 text-white p-1 rounded-full hover:bg-slate-700 shadow-md"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Name*
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    placeholder="Enter your Full Name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    placeholder="Enter your Email Address"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Your qualification*
                  </label>
                  <input
                    type="text"
                    value={profileData.qualification}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        qualification: e.target.value,
                      })
                    }
                    placeholder="E.g. Bachelor of Science"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full bg-[#1E293B] hover:bg-[#0F172A] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center mt-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Get Started"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuthDetails
