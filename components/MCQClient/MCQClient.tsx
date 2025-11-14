"use client"

import useExam from "@/logic/useExam"
import QuestionCard from "@/components/QuestionCard/QuestionCard"
import ChooseAnswer from "@/components/ChooseAnswer/ChooseAnwer"
import QuestionPalette from "@/components/QuestionPalette/QuestionPalette"
import SubmitModal from "@/components/SubmitModal/SubmitModal"
import { Loader2, AlertTriangle } from "lucide-react"

export default function MCQClient() {
  const {
    loading,
    error,
    currentQuestion,
    examMetaData,
    questions,
    currentQuestionIndex,
    answeredCount,
    markedCount,
    answers,
    markedForReview,
    isMarked,
    timeLeft,
    isSubmitModalOpen,
    handleAnswerSelect,
    handleMarkForReview,
    handleNext,
    handlePrevious,
    handlePaletteClick,
    handleActualSubmit,
    visited,
    setIsSubmitModalOpen,
  } = useExam()

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
      </div>
    )
  }

  if (!currentQuestion || !examMetaData) {
    return <div>No questions found.</div>
  }

  return (
    <section className="min-h-screen w-full px-5 gap-5 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] pt-5 bg-background-bg">
      <div className="">
        <div className="flex justify-between px-5">
          <h2 className="font-medium text-[18px] text-brand-text">
            Ancient Indian History MCQ
          </h2>
          <div className="bg-white p-2 rounded-xl">
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
          timeLeft,
          total: questions.length,
          answered: answeredCount,
          marked: markedCount,
        }}
      />
    </section>
  )
}
