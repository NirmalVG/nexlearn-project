"use client"

import { useState } from "react"
import Image from "next/image"
import { IoMdArrowDropright } from "react-icons/io"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react"
import { Question } from "@/redux/types"

const ReadComprehensive = ({ question }: { question: Question }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-[#177A9C] flex flex-between cursor-pointer items-center gap-3 p-4 rounded-lg text-white"
      >
        <Image
          src="/images/article.webp"
          alt="article"
          width={20}
          height={20}
        />
        Read Comprehensive Paragraph
        <IoMdArrowDropright size={25} />
      </button>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in dark:bg-gray-900/50"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform p-5 overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95 dark:bg-gray-800 dark:outline dark:-outline-offset-1 dark:outline-white/10"
            >
              <h3
                id="dialog-title"
                className="text-base font-semibold text-gray-900"
              >
                Comprehensive Paragraph
              </h3>
              <hr className="border-b mt-2 border-[#f2f2f2] mb-5" />
              {question?.comprehension}
              <div className="w-full flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className="mt-5 bg-[#177A9C] w-50 py-3 rounded-lg text-white"
                >
                  Minimize
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default ReadComprehensive
