import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../api/axiosInstance"
import {
  QuestionListResponse,
  SubmitExamResponse,
  AnswerPayload,
  Question,
  ApiErrorResponse,
} from "../types"
import { AxiosError } from "axios"

interface ExamState {
  questions: Question[]
  questions_count: number // <-- ADD THIS
  examMetaData: {
    total_marks: number
    total_time: number
    instruction: string
  } | null
  result: SubmitExamResponse | null
  loading: boolean
  error: string | null
  submissionSuccess: boolean
}

const initialState: ExamState = {
  questions: [],
  questions_count: 0, // <-- ADD THIS
  examMetaData: null,
  result: null,
  loading: false,
  error: null,
  submissionSuccess: false,
}

// --- Thunks ---

export const fetchQuestions = createAsyncThunk<
  QuestionListResponse,
  void,
  { rejectValue: string }
>("exam/list", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<QuestionListResponse>("/question/list")
    return response.data
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>
    return rejectWithValue(
      error.response?.data?.message || "Failed to load questions"
    )
  }
})

export const submitAnswers = createAsyncThunk<
  SubmitExamResponse,
  AnswerPayload[],
  { rejectValue: string }
>("exam/submit", async (answers, { rejectWithValue }) => {
  try {
    // API requires answers to be a JSON stringified array inside FormData
    const formData = new FormData()
    formData.append("answers", JSON.stringify(answers))

    const response = await api.post<SubmitExamResponse>(
      "/answers/submit",
      formData
    )
    return response.data
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>
    return rejectWithValue(error.response?.data?.message || "Submission failed")
  }
})

// --- Slice ---

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    clearExamState: (state) => {
      // <-- MAKE SURE THIS IS HERE
      state.questions = []
      state.questions_count = 0 // <-- ADD THIS
      state.examMetaData = null
      state.result = null
      state.loading = false
      state.error = null
      state.submissionSuccess = false
    },
    resetExamState: (state) => {
      state.result = null
      state.submissionSuccess = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Questions
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false
        state.questions = action.payload.questions
        state.questions_count = action.payload.questions_count // <-- ADD THIS
        state.examMetaData = {
          total_marks: action.payload.total_marks,
          total_time: action.payload.total_time,
          instruction: action.payload.instruction,
        }
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error fetching exam"
      })

      // Submit Answers
      .addCase(submitAnswers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(submitAnswers.fulfilled, (state, action) => {
        state.loading = false
        state.submissionSuccess = true
        state.result = action.payload
      })
      .addCase(submitAnswers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error submitting exam"
      })
  },
})

export const { resetExamState, clearExamState } = examSlice.actions
export default examSlice.reducer
