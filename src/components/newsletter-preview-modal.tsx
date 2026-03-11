"use client"

import { useRef, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { previewNewsletter } from "@/resources/newsletters/actions"

export const NewsletterPreviewModal = ({
  newsletterId,
}: {
  newsletterId: string
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [html, setHtml] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handlePreview() {
    startTransition(async () => {
      const res = await previewNewsletter(newsletterId)
      if (res.error) {
        setError(res.error.message)
      } else {
        setHtml(res.data)
        dialogRef.current?.showModal()
      }
    })
  }

  function handleClose() {
    dialogRef.current?.close()
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={handlePreview}
        disabled={isPending}
      >
        {isPending ? "Loading..." : "Preview"}
      </Button>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <dialog
        ref={dialogRef}
        className="w-full max-w-2xl rounded-lg p-0 backdrop:bg-black/50 open:flex open:flex-col"
        onClick={(e) => {
          if (e.target === dialogRef.current) handleClose()
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="text-sm font-medium">Email Preview</span>
          <Button size="sm" variant="ghost" onClick={handleClose}>
            Close
          </Button>
        </div>
        {html && (
          <iframe
            srcDoc={html}
            className="w-full flex-1"
            style={{ height: "70vh", border: "none" }}
            title="Email Preview"
          />
        )}
      </dialog>
    </>
  )
}
