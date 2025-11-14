// @ts-ignore - allow side-effect CSS import without type declarations
import "../globals.css"
import ReduxProvider from "@/redux/reduxProvider"

export const metadata = {
  title: "NexLearn: Online Exam Platform",
  description:
    "A responsive online exam platform built with Next.js (App Router), Redux Toolkit, and Tailwind CSS. It features a complete user authentication flow using phone OTP and a full-featured, persistent exam interface.",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased" cz-shortcut-listen="true">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}
