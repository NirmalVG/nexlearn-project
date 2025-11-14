import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import examReducer from "./slices/examSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exam: examReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["auth/createProfile/pending"],
        ignoredActionPaths: ["meta.arg.profile_image", "payload.profile_image"],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
