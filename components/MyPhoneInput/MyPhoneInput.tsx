"use client"
import PhoneInput from "react-phone-number-input"
import { useState } from "react"
import { Check } from "lucide-react"

import "./MyPhoneInput.css"

const MyPhoneInput = ({ setMobile }: any) => {
  const [value, setValue] = useState<string | undefined>()
  const [country, setCountry] = useState<string>("IN")

  return (
    <div className="bg-background">
      <div className="relative w-full max-w-sm">
        <label
          className="
          absolute 
          -top-2.5
          left-3
          inline-flex 
          items-center
          gap-1.5
          bg-background 
          px-1 
          text-xs 
          font-medium 
          text-muted-foreground
          z-10
        "
        >
          <Check className="w-3.5 h-3.5 text-green-500" strokeWidth={3} />
          Phone number
        </label>
        <div
          className="
          flex items-center 
          border border-input
          rounded-md 
          px-3 py-2.5
          bg-background
          focus-within:border-ring 
          focus-within:ring-1 
          focus-within:ring-ring
          transition-colors
        "
        >
          <PhoneInput
            placeholder="1234 567891"
            value={value}
            onChange={(val) => {
              setValue(val)
              setMobile(val ? val.replace(/\D/g, "") : "")
            }}
            country={country}
            international={true}
            className="flex-1 bg-transparent outline-none flex items-center"
            numberInputProps={{
              className:
                "w-full bg-transparent outline-none border-none text-foreground placeholder-muted-foreground focus:ring-0 text-sm font-medium",
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default MyPhoneInput
