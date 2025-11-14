import Image from "next/image"
import ReadComprehensive from "../ReadComprehensive/ReadComprehensive"
import { Question } from "@/redux/types"

interface QuestionCardProps {
  question: Question
  questionNumber: number
}

const QuestionCard = ({ question, questionNumber }: QuestionCardProps) => {
  console.log(question, "adjfjdfk")
  return (
    <div className="bg-white mt-5 p-5 rounded-lg">
      <ReadComprehensive question={question} />
      <p className="mt-5 font-medium text-[18px] text-brand-text">
        <>{`${questionNumber}. ${question.question}`}</>
      </p>
      <div className="relative w-[300px] h-[200px] rounded-xl overflow-hidden mt-5">
        <Image
          src={question?.image || "/images/placeholder.webp"}
          alt="article"
          fill
          className="object-cover"
        />
      </div>
    </div>
  )
}

export default QuestionCard
