"use client" // <-- Must be a client component

import { useEffect } from "react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { clearExamState, fetchQuestions } from "@/redux/slices/examSlice"
import { Loader2, AlertTriangle } from "lucide-react"

// Import your presentation components
import ExamStatsBar from "@/components/ExamStatsBar/ExamStatsBar"
import Instructions from "@/components/Instructions/Instructions"

export default function InstructionsPage() {
  const dispatch = useAppDispatch()
  const { examMetaData, questions_count, loading, error } = useAppSelector(
    (state) => state.exam
  )

  useEffect(() => {
    // 1. Clear any old exam results from persisted state
    dispatch(clearExamState())
    // 2. Fetch the new exam data (instructions, total marks, etc.)
    dispatch(fetchQuestions())
  }, [dispatch])

  // Handle Loading State
  if (loading) {
    return (
      <section className="bg-background-bg min-h-screen w-full flex flex-col items-center justify-center px-4 py-10">
        <Loader2 className="w-12 h-12 animate-spin text-brand-bg" />
        <p className="mt-4 text-lg font-medium">Loading Exam Details...</p>
      </section>
    )
  }

  // Handle Error State
  if (error || !examMetaData) {
    return (
      <section className="bg-background-bg min-h-screen w-full flex flex-col items-center justify-center px-4 py-10">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <p className="mt-4 text-lg font-medium text-red-600">
          Failed to load exam details.
        </p>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => dispatch(fetchQuestions())}
          className="bg-brand-bg text-white w-full max-w-[361px] mt-6 py-4 rounded-xl text-[17px]"
        >
          Try Again
        </button>
      </section>
    )
  }

  // Render Page with Loaded Data
  return (
    <section className="bg-background-bg min-h-screen w-full flex flex-col items-center px-4 py-6 sm:py-10">
      <h1 className="text-4xl font-medium text-center">
        Ancient Indian History MCQ
      </h1>

      {/* Pass data as props */}
      <ExamStatsBar
        totalQuestions={questions_count}
        totalMarks={examMetaData.total_marks}
        totalTime={examMetaData.total_time}
      />

      {/* Pass data as props */}
      <Instructions instructionText={examMetaData.instruction} />

      {/* Fixed: Use Link styled as a button */}
      <Link
        href="/mcq"
        className="bg-brand-bg text-white w-full max-w-[361px] mt-6 py-4 rounded-xl text-[17px] text-center transition-opacity hover:opacity-90"
      >
        Start Test
      </Link>
    </section>
  )
}
