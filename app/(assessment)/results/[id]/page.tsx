"use client"

import { useAppSelector } from "@/redux/hooks"
import { useRouter, useParams } from "next/navigation"
import {
  HelpCircle,
  CheckSquare,
  XSquare,
  FileQuestion,
  AlertTriangle,
  LucideIcon,
} from "lucide-react"
import React, { useEffect } from "react"

interface StatRowProps {
  icon: LucideIcon
  label: string
  value: string | number
  iconClass: string
}

const StatRow: React.FC<StatRowProps> = ({
  icon: Icon,
  label,
  value,
  iconClass,
}) => {
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

export default function ResultPage() {
  const router = useRouter()
  const params = useParams()
  const { id: examHistoryId } = params

  const { result, examMetaData } = useAppSelector((state) => state.exam)

  if (!result || !examMetaData || result.exam_history_id != examHistoryId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
        <AlertTriangle className="h-16 w-16 text-red-500" />
        <h1 className="mt-4 text-2xl font-bold text-gray-800">
          Result Not Found
        </h1>
        <p className="mt-2 text-center text-gray-600">
          This may be because you refreshed the page or landed here directly.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-blue-700"
        >
          Go to Home
        </button>
      </div>
    )
  }

  const { score, correct, wrong, not_attended } = result
  const { total_marks } = examMetaData
  const questions_count = (examMetaData as any).questions_count ?? 0

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-bg p-4">
      <div className="w-full max-w-md overflow-hidden  bg-white ">
        <div className="bg-linear-to-r from-[#177A9C] rounded-xl via-[#20384a] to-[#1c3141] p-6 text-center text-white">
          <h2 className="text-lg font-medium opacity-80">Marks Obtained:</h2>
          <div className="mt-2 text-6xl font-bold">
            {score} / {total_marks}
          </div>
        </div>

        <div className="space-y-5 p-6 bg-background-bg">
          <StatRow
            icon={HelpCircle}
            label="Total Questions:"
            value={total_marks}
            iconClass="text-yellow-600 bg-yellow-100"
          />
          <StatRow
            icon={CheckSquare}
            label="Correct Answers:"
            value={String(correct).padStart(3, "0")}
            iconClass="text-green-600 bg-green-100"
          />
          <StatRow
            icon={XSquare}
            label="Incorrect Answers:"
            value={String(wrong).padStart(3, "0")}
            iconClass="text-red-600 bg-red-100"
          />
          <StatRow
            icon={FileQuestion}
            label="Not Attended Questions:"
            value={String(not_attended).padStart(3, "0")}
            iconClass="text-gray-500 bg-gray-100"
          />
        </div>

        <div className="p-6 pt-0">
          <button
            onClick={() => router.push("/")}
            className="w-full rounded-lg bg-[#1E293B] py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
