"use client"

import Link from "next/link"
import { Loader2, AlertTriangle } from "lucide-react"
import { useExamInstructions } from "@/logic/useExamInstructions"

import ExamStatsBar from "@/components/ExamStatsBar/ExamStatsBar"
import Instructions from "@/components/Instructions/Instructions"

export default function InstructionsClient() {
  const { loading, error, examMetaData, questions_count, retryFetch } =
    useExamInstructions()

  if (loading) {
    return (
      <section className="bg-background-bg min-h-screen w-full flex flex-col items-center justify-center px-4 py-10">
        <Loader2 className="w-12 h-12 animate-spin text-brand-bg" />
        <p className="mt-4 text-lg font-medium">Loading Exam Details...</p>
      </section>
    )
  }

  if (error || !examMetaData) {
    return (
      <section className="bg-background-bg min-h-screen w-full flex flex-col items-center justify-center px-4 py-10">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <p className="mt-4 text-lg font-medium text-red-600">
          Failed to load exam details.
        </p>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={retryFetch}
          className="bg-brand-bg text-white w-full max-w-[361px] mt-6 py-4 rounded-xl text-[17px]"
        >
          Try Again
        </button>
      </section>
    )
  }

  return (
    <section className="bg-background-bg min-h-screen w-full flex flex-col items-center px-4 py-6 sm:py-10">
      <h1 className="text-4xl font-medium text-center">
        Ancient Indian History MCQ
      </h1>

      <ExamStatsBar
        totalQuestions={questions_count}
        totalMarks={examMetaData.total_marks}
        totalTime={examMetaData.total_time}
      />

      <Instructions instructionText={examMetaData.instruction} />

      <Link
        href="/mcq"
        className="bg-brand-bg text-white w-full max-w-[361px] mt-6 py-4 rounded-xl text-[17px] text-center transition-opacity hover:opacity-90"
      >
        Start Test
      </Link>
    </section>
  )
}
