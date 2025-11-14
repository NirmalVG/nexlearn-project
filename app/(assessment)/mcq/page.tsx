"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchQuestions, submitAnswers } from "@/redux/slices/examSlice"
import { AnswerPayload, Question } from "@/redux/types"
import { Loader2, AlertTriangle } from "lucide-react"
import ChooseAnswer from "@/components/ChooseAnswer/ChooseAnwer"
import QuestionCard from "@/components/QuestionCard/QuestionCard"
import QuestionPalette from "@/components/QuestionPalette/QuestionPalette"
import SubmitModal from "@/components/SubmitModal/SubmitModal"

export default function MCQPage() {
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

  useEffect(() => {
    dispatch(fetchQuestions())
  }, [dispatch])

  const currentQuestion: Question | undefined = questions[currentQuestionIndex]

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
      setVisited((prevVisited) => {
        if (prevVisited.has(currentQuestion.question_id)) return prevVisited
        const newSet = new Set(prevVisited)
        newSet.add(currentQuestion.question_id)
        return newSet
      })
    }
  }, [examMetaData, questions, timeLeft, answers.size, currentQuestion])

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime && prevTime <= 1) {
          clearInterval(interval)
          handleActualSubmit()
          return 0
        }
        return prevTime ? prevTime - 1 : 0
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
      const newSet = new Set(prev)
      newSet.has(currentQuestion.question_id)
        ? newSet.delete(currentQuestion.question_id)
        : newSet.add(currentQuestion.question_id)
      return newSet
    })
  }

  const handleNext = () => {
    const isLastQuestion = currentQuestionIndex === questions.length - 1

    if (isLastQuestion) {
      setIsSubmitModalOpen(true)
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handlePaletteClick = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const handleActualSubmit = async () => {
    const answerPayload: AnswerPayload[] = Array.from(answers.entries()).map(
      ([question_id, selected_option_id]) => ({
        question_id,
        selected_option_id: selected_option_id ?? null,
      })
    )

    const result = await dispatch(submitAnswers(answerPayload))

    if (submitAnswers.fulfilled.match(result)) {
      router.push(`/results/${result.payload.exam_history_id}`)
    } else {
      setIsSubmitModalOpen(false)
      alert("Submission failed. Please try again.")
    }
  }

  if (loading && questions.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-lg font-medium">Loading Exam...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2 text-red-600">
        <AlertTriangle className="h-10 w-10" />
        <span className="text-lg font-semibold">Error: {error}</span>
        <button
          onClick={() => dispatch(fetchQuestions())}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!currentQuestion || !examMetaData) {
    return <div>No questions found.</div>
  }

  const answeredCount = Array.from(answers.values()).filter(
    (val) => val != null
  ).length
  const markedCount = markedForReview.size
  const isMarked = markedForReview.has(currentQuestion.question_id)

  return (
    <section className="min-h-screen w-full px-5 gap-5 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] pt-5 bg-background-bg">
      <div className="">
        <div className=" flex justify-between px-5">
          <div>
            <h2 className="font-medium text-[18px] text-brand-text">
              Ancient Indian History MCQ
            </h2>
          </div>
          <div className="bg-white p-2 rounded-xl ">
            {currentQuestionIndex + 1}/{questions.length}
          </div>
        </div>
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
        />
        <ChooseAnswer
          options={currentQuestion.options}
          selectedOptionId={answers.get(currentQuestion.question_id) || null}
          onAnswerSelect={handleAnswerSelect}
          onMarkForReview={handleMarkForReview}
          isMarked={isMarked}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isFirstQuestion={currentQuestionIndex === 0}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
        />
      </div>
      <div className="border-l px-5 border-[#e9ebec]">
        <QuestionPalette
          questions={questions}
          answers={answers}
          markedForReview={markedForReview}
          currentIndex={currentQuestionIndex}
          onQuestionClick={handlePaletteClick}
          timeLeft={timeLeft}
          onTimeUp={handleActualSubmit}
          visited={visited}
          onSubmit={() => setIsSubmitModalOpen(true)}
        />
      </div>
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleActualSubmit}
        stats={{
          timeLeft: timeLeft,
          total: questions.length,
          answered: answeredCount,
          marked: markedCount,
        }}
      />
    </section>
  )
}
