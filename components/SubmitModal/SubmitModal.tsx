"use client"

import {
  Clock,
  HelpCircle,
  CheckSquare,
  Bookmark,
  X,
  Loader2,
} from "lucide-react"
import { useState } from "react"

interface SubmitModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => Promise<void>
  stats: {
    timeLeft: number | null
    total: number
    answered: number
    marked: number
  }
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
}

const SubmitModal = ({
  isOpen,
  onClose,
  onSubmit,
  stats,
}: SubmitModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await onSubmit()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Are you sure you want to submit the test?
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <StatRow
            icon={Clock}
            label="Remaining Time:"
            value={
              stats.timeLeft !== null ? formatTime(stats.timeLeft) : "00:00"
            }
            iconClass="text-blue-600 bg-blue-100"
          />
          <StatRow
            icon={HelpCircle}
            label="Total Questions:"
            value={stats.total}
            iconClass="text-yellow-600 bg-yellow-100"
          />
          <StatRow
            icon={CheckSquare}
            label="Questions Answered:"
            value={String(stats.answered).padStart(3, "0")}
            iconClass="text-green-600 bg-green-100"
          />
          <StatRow
            icon={Bookmark}
            label="Marked for review:"
            value={String(stats.marked).padStart(3, "0")}
            iconClass="text-purple-600 bg-purple-100"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="mt-8 flex w-full items-center justify-center rounded-lg bg-[#1E293B] py-3 text-base font-semibold text-white shadow-lg transition-colors hover:bg-opacity-90 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            "Submit Test"
          )}
        </button>
      </div>
    </div>
  )
}

const StatRow = ({ icon: Icon, label, value, iconClass }: any) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full ${iconClass}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-base font-medium text-gray-600">{label}</span>
    </div>
    <span className="font-mono text-lg font-bold text-gray-800">{value}</span>
  </div>
)

export default SubmitModal
