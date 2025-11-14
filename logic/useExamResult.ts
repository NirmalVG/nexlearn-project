"use client"

import { useAppSelector } from "@/redux/hooks"
import { useRouter, useParams } from "next/navigation"
import { useMemo } from "react"

export default function useExamResult() {
  const router = useRouter()
  const params = useParams()
  const examHistoryId = params.id as string

  const { result, examMetaData } = useAppSelector((state) => state.exam)

  const isValid = useMemo(() => {
    if (!result || !examMetaData) return false
    return String(result.exam_history_id) === String(examHistoryId)
  }, [result, examMetaData, examHistoryId])

  const onGoHome = () => {
    router.push("/")
  }

  const stats = useMemo(() => {
    if (!result || !examMetaData) {
      return {
        score: 0,
        correct: 0,
        wrong: 0,
        not_attended: 0,
        total_marks: 0,
      }
    }

    return {
      score: result.score,
      correct: result.correct,
      wrong: result.wrong,
      not_attended: result.not_attended,
      total_marks: examMetaData.total_marks,
    }
  }, [result, examMetaData])

  return {
    examHistoryId,
    result,
    examMetaData,
    isValid,
    stats,
    onGoHome,
  }
}
