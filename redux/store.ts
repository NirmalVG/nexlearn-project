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
        // Ignore these paths for serializable check if necessary
        // (e.g. generally file objects in thunk args are okay but might warn)
        ignoredActions: ["auth/createProfile/pending"],
        ignoredActionPaths: ["meta.arg.profile_image", "payload.profile_image"],
      },
    }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
