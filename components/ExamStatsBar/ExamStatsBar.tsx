const formatTime = (timeInMinutes: number) => {
  const minutes = String(timeInMinutes).padStart(2, "0")
  return `${minutes}:00`
}

interface ExamStatsBarProps {
  totalQuestions: number
  totalMarks: number
  totalTime: number
}

const ExamStatsBar = ({
  totalQuestions,
  totalMarks,
  totalTime,
}: ExamStatsBarProps) => {
  return (
    <div className="bg-brand-bg rounded-xl text-white mt-10 grid items-center justify-center w-full max-w-[682px] h-auto grid-cols-1 gap-6 py-6 md:w-[682px] md:h-[136px] md:grid-cols-3 md:gap-[57px] md:py-0">
      <div className="text-center">
        <p className="text-[14px] md:text-[16px]">
          Total MCQ's:
          <br />
          <span className="font-normal text-[32px] md:text-[42px]">
            {totalQuestions}
          </span>
        </p>
      </div>

      <div className="text-center">
        <p className="text-[14px] md:text-[16px]">
          Total Marks:
          <br />
          <span className="font-normal text-[32px] md:text-[42px]">
            {totalMarks}
          </span>
        </p>
      </div>

      <div className="text-center">
        <p className="text-[14px] md:text-[16px]">
          Total Time:
          <br />
          <span className="font-normal text-[32px] md:text-[42px]">
            {formatTime(totalTime)}
          </span>
        </p>
      </div>
    </div>
  )
}

export default ExamStatsBar
