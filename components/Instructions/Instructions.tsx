interface InstructionsProps {
  instructionText: string
}

const Instructions = ({ instructionText }: InstructionsProps) => {
  return (
    <div className="self-start mt-10 w-full max-w-[682px] mx-auto px-4 sm:px-0 text-[#5C5C5C]">
      <h2 className="text-base font-bold mb-2">Instructions:</h2>
      <div
        className="list-disc pl-5 space-y-2 text-sm sm:text-base"
        dangerouslySetInnerHTML={{ __html: instructionText }}
      />
    </div>
  )
}

export default Instructions
