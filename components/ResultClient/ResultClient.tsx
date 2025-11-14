"use client"

import {
  HelpCircle,
  CheckSquare,
  XSquare,
  FileQuestion,
  AlertTriangle,
  LucideIcon,
} from "lucide-react"

import useExamResult from "@/logic/useExamResult"

interface StatRowProps {
  icon: LucideIcon
  label: string
  value: string | number
  iconClass: string
}

const StatRow = ({ icon: Icon, label, value, iconClass }: StatRowProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-base font-medium text-gray-700">{label}</span>
      </div>
      <span className="font-mono text-xl font-bold text-gray-800">{value}</span>
    </div>
  )
}

export default function ResultClient() {
  const { isValid, stats, onGoHome } = useExamResult()

  if (!isValid) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
        <AlertTriangle className="h-16 w-16 text-red-500" />
        <h1 className="mt-4 text-2xl font-bold text-gray-800">
          Result Not Found
        </h1>
        <p className="mt-2 text-center text-gray-600">
          You may have refreshed the page or opened this link directly.
        </p>
        <button
          onClick={onGoHome}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-blue-700"
        >
          Go to Home
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-bg p-4">
      <div className="w-full max-w-md overflow-hidden bg-white">
        {/* Banner */}
        <div className="rounded-xl bg-gradient-to-r from-[#177A9C] via-[#20384a] to-[#1c3141] p-6 text-center text-white">
          <h2 className="text-lg font-medium opacity-80">Marks Obtained:</h2>
          <div className="mt-2 text-6xl font-bold">
            {stats.score} / {stats.total_marks}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-5 p-6 bg-background-bg">
          <StatRow
            icon={HelpCircle}
            label="Total Questions:"
            value={stats.total_marks}
            iconClass="text-yellow-600 bg-yellow-100"
          />
          <StatRow
            icon={CheckSquare}
            label="Correct Answers:"
            value={String(stats.correct).padStart(3, "0")}
            iconClass="text-green-600 bg-green-100"
          />
          <StatRow
            icon={XSquare}
            label="Incorrect Answers:"
            value={String(stats.wrong).padStart(3, "0")}
            iconClass="text-red-600 bg-red-100"
          />
          <StatRow
            icon={FileQuestion}
            label="Not Attended:"
            value={String(stats.not_attended).padStart(3, "0")}
            iconClass="text-gray-600 bg-gray-200"
          />
        </div>

        <div className="p-6 pt-0">
          <button
            onClick={onGoHome}
            className="w-full rounded-lg bg-[#1E293B] py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
