import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
// @ts-ignore - allow side-effect CSS import without type declarations
import "../globals.css"
import CommonLayout from "@/layout/CommonLayout"
import ReduxProvider from "@/redux/reduxProvider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "NexLearn: Online Exam Platform",
  description:
    "A responsive online exam platform built with Next.js (App Router), Redux Toolkit, and Tailwind CSS. It features a complete user authentication flow using phone OTP and a full-featured, persistent exam interface.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        cz-shortcut-listen="true"
      >
        <ReduxProvider>
          <CommonLayout>{children}</CommonLayout>
        </ReduxProvider>
      </body>
    </html>
  )
}
