"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { clearExamState, fetchQuestions } from "@/redux/slices/examSlice"

export function useExamInstructions() {
  const dispatch = useAppDispatch()
  const { examMetaData, questions_count, loading, error } = useAppSelector(
    (state) => state.exam
  )

  useEffect(() => {
    dispatch(clearExamState())
    dispatch(fetchQuestions())
  }, [dispatch])

  const retryFetch = () => {
    dispatch(fetchQuestions())
  }

  return {
    loading,
    error,
    examMetaData,
    questions_count,
    retryFetch,
  }
}
