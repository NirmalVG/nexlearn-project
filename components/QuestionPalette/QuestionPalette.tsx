import { Question } from "@/redux/types"
import { RiTimer2Fill } from "react-icons/ri"

interface PaletteProps {
  questions: Question[]
  answers: Map<number, number | null>
  markedForReview: Set<number>
  currentIndex: number
  onQuestionClick: (index: number) => void
  timeLeft: number | null
  onTimeUp: () => void
  visited: Set<number>
  onSubmit: () => void
}

const formatTime = (seconds: number) => {
  if (seconds === null || seconds < 0) seconds = 0
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
}

const QuestionPalette = ({
  questions,
  answers,
  markedForReview,
  currentIndex,
  onQuestionClick,
  timeLeft,
  onTimeUp,
  visited,
  onSubmit,
}: PaletteProps) => {
  const getStatusClass = (question: Question, index: number) => {
    const questionId = question.question_id
    const isMarked = markedForReview.has(questionId)
    const isAnswered = answers.get(questionId) != null
    const isCurrent = index === currentIndex
    const isVisited = visited.has(questionId)

    let baseClass =
      "w-full aspect-square flex items-center justify-center rounded-md font-medium cursor-pointer transition-all text-sm "

    if (isAnswered && isMarked) {
      baseClass += "bg-purple-600 text-white relative"
    } else if (isMarked) {
      baseClass += "bg-purple-600 text-white"
    } else if (isAnswered) {
      baseClass += "bg-green-600 text-white"
    } else if (isVisited) {
      baseClass += "bg-red-600 text-white"
    } else {
      baseClass += "bg-white text-gray-700 border border-gray-300"
    }

    if (isCurrent) {
      baseClass += " ring-2 ring-offset-2 ring-blue-500"
    }

    return baseClass
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <p className="font-semibold text-gray-800">Question No. Sheet:</p>
        <p className="flex items-center gap-2">
          <span className="font-medium">Remaining time:</span>
          <span
            className={`bg-[#1E293B] text-white px-3 py-1 flex items-center gap-1 rounded ${
              timeLeft !== null && timeLeft < 300 ? " bg-red-600" : ""
            }`}
          >
            <RiTimer2Fill />
            {timeLeft !== null ? formatTime(timeLeft) : "00:00"}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mt-4">
        {questions.map((question, index) => (
          <button
            key={question.question_id}
            onClick={() => onQuestionClick(index)}
            className={getStatusClass(question, index)}
            aria-label={`Go to question ${index + 1}`}
          >
            {index + 1}
            {markedForReview.has(question.question_id) &&
              answers.get(question.question_id) != null && (
                <span className="absolute bottom-1 right-1 w-2 h-2 bg-green-400 rounded-full border border-white"></span>
              )}
          </button>
        ))}
      </div>

      <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-2 mt-5">
        <div className="flex gap-2 items-center">
          <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
          <p className="text-sm text-gray-600">Attended</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-4 h-4 bg-[#ee3535] rounded-sm"></div>
          <p className="text-sm text-gray-600">Not Attended</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-4 h-4 bg-purple-600 rounded-sm"></div>
          <p className="text-sm text-gray-600">Mark for Review</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative w-4 h-4 bg-purple-600 rounded-sm">
            <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full"></div>
          </div>
          <p className="text-sm text-gray-600">Answered and Marked</p>
        </div>
      </div>
      <button
        onClick={onSubmit}
        className="w-full py-3 mt-4 font-bold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700"
      >
        Submit Exam
      </button>
    </div>
  )
}

export default QuestionPalette
