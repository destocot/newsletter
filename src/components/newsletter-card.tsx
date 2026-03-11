"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TiptapEditor } from "@/components/tiptap-editor"
import { type ActionResponse } from "@/lib/response"
import { NewsletterPreviewModal } from "@/components/newsletter-preview-modal"
import {
  archiveNewsletter,
  updateBlurb,
  sendNewsletter,
  resendNewsletter,
  sendTestNewsletter,
} from "@/resources/newsletters/actions"

interface Newsletter {
  id: string
  blurb: string
  spotifyPlaylistUrl: string
  sentAt: Date | null
  createdAt: Date
}

export const NewsletterCard = ({ newsletter }: { newsletter: Newsletter }) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isEditing, setIsEditing] = useState(false)
  const [blurb, setBlurb] = useState(newsletter.blurb)
  const [editorKey, setEditorKey] = useState(0)
  const [message, setMessage] = useState<{
    text: string
    ok: boolean
  } | null>(null)

  const textPreview = newsletter.blurb.replace(/<[^>]*>/g, "").trim()

  function msg(res: ActionResponse<boolean>, successText: string) {
    setMessage({
      text: !res.error ? successText : res.error.message,
      ok: !res.error,
    })
  }

  function handleEdit() {
    setBlurb(newsletter.blurb)
    setEditorKey((k) => k + 1)
    setIsEditing(true)
    setMessage(null)
  }

  function handleCancel() {
    setIsEditing(false)
    setMessage(null)
  }

  function handleSave() {
    startTransition(async () => {
      const res = await updateBlurb(newsletter.id, blurb)
      msg(res, "Blurb saved.")
      if (!res.error) {
        setIsEditing(false)
        router.refresh()
      }
    })
  }

  function handleSend() {
    startTransition(async () => {
      const res = newsletter.sentAt
        ? await resendNewsletter(newsletter.id)
        : await sendNewsletter(newsletter.id)
      msg(res, newsletter.sentAt ? "Resent!" : "Sent!")
      if (!res.error) router.refresh()
    })
  }

  function handleTest() {
    startTransition(async () => {
      const res = await sendTestNewsletter(newsletter.id)
      msg(res, "Test email sent.")
    })
  }

  function handleArchive() {
    startTransition(async () => {
      await archiveNewsletter(newsletter.id)
    })
  }

  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        {isEditing ? (
          <TiptapEditor key={editorKey} content={blurb} onChange={setBlurb} />
        ) : (
          <p className="text-sm line-clamp-3 text-foreground/80">
            {textPreview || (
              <span className="italic text-muted-foreground">
                No blurb yet.
              </span>
            )}
          </p>
        )}

        <a
          href={newsletter.spotifyPlaylistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground underline underline-offset-2 truncate block"
        >
          {newsletter.spotifyPlaylistUrl}
        </a>

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">
            Created{" "}
            {new Date(newsletter.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>

          <div className="flex items-center gap-1.5 flex-wrap">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave} disabled={isPending}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleEdit}
                  disabled={isPending}
                >
                  Edit
                </Button>
                <NewsletterPreviewModal newsletterId={newsletter.id} />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleTest}
                  disabled={isPending}
                >
                  Test
                </Button>
                {newsletter.sentAt ? (
                  <Button size="sm" onClick={handleSend} disabled={isPending}>
                    Resend
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleSend} disabled={isPending}>
                    Send
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleArchive}
                  disabled={isPending}
                  className="text-destructive hover:text-destructive"
                >
                  Archive
                </Button>
              </>
            )}
          </div>
        </div>

        {newsletter.sentAt && !isEditing && (
          <p className="text-xs text-green-700">
            Sent{" "}
            {new Date(newsletter.sentAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}

        {message && (
          <p
            className={
              message.ok ? "text-xs text-green-700" : "text-xs text-destructive"
            }
          >
            {message.text}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
