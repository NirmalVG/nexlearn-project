"use client"
// No longer need useState
// import { useState } from "react"

interface Option {
  id: number
  option: string
}

interface ChooseAnswerProps {
  options: Option[]
  selectedOptionId: number | null
  onAnswerSelect: (optionId: number) => void // This will now be used
  onMarkForReview: () => void
  isMarked: boolean
  onNext: () => void
  onPrevious: () => void
  isFirstQuestion: boolean
  isLastQuestion: boolean
}

const ChooseAnswer = ({
  options,
  selectedOptionId,
  onAnswerSelect,
  onMarkForReview,
  isMarked,
  onNext,
  onPrevious,
  isFirstQuestion,
  isLastQuestion,
}: ChooseAnswerProps) => {
  return (
    <div className="flex flex-col justify-center items-center mt-5">
      <div className="w-full rounded-xl">
        <h2 className="text-gray-600 text-lg mb-6 font-medium">
          Choose the answer:
        </h2>
        <div className="space-y-4 mb-10">
          {/* 4. Add 'index' to map to get A, B, C... */}
          {options.map((option, index) => (
            <div
              key={option.id}
              // 2. CALL the prop function on click
              onClick={() => onAnswerSelect(option.id)}
              className={`
                group flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                ${
                  selectedOptionId === option.id // 3. USE the prop for styling
                    ? "border-blue-500 bg-blue-50 shadow-md" // Changed style to be more obvious
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }
              `}
            >
              <span className="text-slate-700 font-semibold text-lg">
                {/* Use index to create A, B, C... */}
                {String.fromCharCode(65 + index)}.{" "}
                <span className="text-slate-600 font-medium ml-1">
                  {option.option} {/* No optional chaining needed */}
                </span>
              </span>

              <div
                className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${
                    selectedOptionId === option.id // 3. USE the prop for styling
                      ? "border-blue-600" // Changed to blue
                      : "border-gray-400"
                  }
                `}
              >
                {selectedOptionId === option.id && ( // 3. USE the prop
                  <div className="w-3 h-3 bg-blue-600 rounded-full" /> // Changed to blue
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid flex-col md:flex-row grid-cols-3 justify-between items-center gap-4 mt-8 mb-8">
          <button
            className={`py-3 rounded-lg text-white ${
              isMarked ? "bg-purple-800" : "bg-[#800080] hover:bg-purple-800"
            }`}
            onClick={onMarkForReview}
          >
            {isMarked ? "Marked for review" : "Mark for review"}
          </button>

          <button
            onClick={onPrevious}
            disabled={isFirstQuestion}
            className="bg-[#cecece] py-3 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>

          <button
            className="bg-[#1c3141] py-3 rounded-lg text-white disabled:opacity-50"
            onClick={onNext}
            disabled={isLastQuestion}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChooseAnswer
