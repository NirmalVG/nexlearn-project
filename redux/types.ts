// --- Common ---
export interface ApiErrorResponse {
  success: boolean
  message: string
}

// --- Auth ---
export interface UserProfile {
  id: number // Assuming ID exists, based on typical APIs
  name: string
  email: string
  mobile: string
  qualification: string
  profile_image?: string
}

export interface SendOtpResponse {
  success: boolean
  message: string
}

export interface VerifyOtpResponse {
  success: boolean
  login: boolean
  message: string
  access_token?: string
  refresh_token?: string
  token_type?: string
}

export interface CreateProfileResponse {
  success: boolean
  message: string
  access_token: string
  refresh_token: string
  user: UserProfile
}

export interface CreateProfilePayload {
  mobile: string
  name: string
  email: string
  qualification: string
  profile_image: File | null
}

export interface Option {
  id: number
  option_text: string
}

export interface ExamOption {
  id: number
  option: string
  is_correct: boolean
  image: string | null
}

export interface Question {
  question_id: number
  number: number
  question: string
  comprehension: string | null
  image: string | null
  options: ExamOption[]
}

export interface QuestionListResponse {
  success: boolean
  questions_count: number
  total_marks: number
  total_time: number
  time_for_each_question: number
  mark_per_each_answer: number
  instruction: string
  questions: Question[]
}

export interface AnswerPayload {
  question_id: number
  selected_option_id: number | null
}

export interface ExamResultDetails {
  question_id: number
  correct: boolean
}

export interface SubmitExamResponse {
  success: boolean
  exam_history_id: string
  score: number
  correct: number
  wrong: number
  not_attended: number
  submitted_at: string
  details: ExamResultDetails[]
}
