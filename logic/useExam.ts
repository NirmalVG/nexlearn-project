"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchQuestions, submitAnswers } from "@/redux/slices/examSlice"
import { AnswerPayload, Question } from "@/redux/types"

export default function useExam() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { questions, examMetaData, loading, error } = useAppSelector(
    (state) => state.exam
  )

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<number, number | null>>(new Map())
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set())
  const [visited, setVisited] = useState<Set<number>>(new Set())
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)

  const currentQuestion: Question | undefined = questions[currentQuestionIndex]

  // Fetch questions
  useEffect(() => {
    dispatch(fetchQuestions())
  }, [dispatch])

  // Initialize answers + timer
  useEffect(() => {
    if (examMetaData && questions.length > 0) {
      if (timeLeft === null) {
        setTimeLeft(examMetaData.total_time * 60)
      }
      if (answers.size === 0) {
        setAnswers(new Map(questions.map((q) => [q.question_id, null])))
      }
    }

    if (currentQuestion) {
      setVisited((prev) => {
        const next = new Set(prev)
        next.add(currentQuestion.question_id)
        return next
      })
    }
  }, [examMetaData, questions, currentQuestion])

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev && prev <= 1) {
          clearInterval(interval)
          handleActualSubmit()
          return 0
        }
        return prev ? prev - 1 : 0
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft])

  const handleAnswerSelect = (optionId: number) => {
    if (!currentQuestion) return
    setAnswers((prev) =>
      new Map(prev).set(currentQuestion.question_id, optionId)
    )
  }

  const handleMarkForReview = () => {
    if (!currentQuestion) return
    setMarkedForReview((prev) => {
      const next = new Set(prev)
      next.has(currentQuestion.question_id)
        ? next.delete(currentQuestion.question_id)
        : next.add(currentQuestion.question_id)
      return next
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex === questions.length - 1) {
      setIsSubmitModalOpen(true)
      return
    }
    setCurrentQuestionIndex((i) => i + 1)
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((i) => i - 1)
    }
  }

  const handlePaletteClick = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const handleActualSubmit = async () => {
    const payload: AnswerPayload[] = Array.from(answers.entries()).map(
      ([question_id, selected_option_id]) => ({
        question_id,
        selected_option_id: selected_option_id ?? null,
      })
    )

    const result = await dispatch(submitAnswers(payload))

    if (submitAnswers.fulfilled.match(result)) {
      router.push(`/results/${result.payload.exam_history_id}`)
    } else {
      setIsSubmitModalOpen(false)
      alert("Submission failed. Please try again.")
    }
  }

  const answeredCount = Array.from(answers.values()).filter(
    (v) => v !== null
  ).length
  const markedCount = markedForReview.size
  const isMarked = currentQuestion
    ? markedForReview.has(currentQuestion.question_id)
    : false

  return {
    // Redux/State
    loading,
    error,
    questions,
    examMetaData,

    // Question Data
    currentQuestion,
    currentQuestionIndex,
    answers,
    markedForReview,
    visited,
    timeLeft,

    // UI State
    isMarked,
    isSubmitModalOpen,
    answeredCount,
    markedCount,

    // Handlers
    handleAnswerSelect,
    handleMarkForReview,
    handleNext,
    handlePrevious,
    handlePaletteClick,
    handleActualSubmit,
    setIsSubmitModalOpen,
  }
}
