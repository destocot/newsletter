"use client"

import { useRef, useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TiptapEditor } from "@/components/tiptap-editor"
import { type ActionResponse } from "@/lib/response"
import { createNewsletter } from "@/resources/newsletters/actions"

export const CreateNewsletterForm = () => {
  const [isPending, startTransition] = useTransition()
  const [blurb, setBlurb] = useState("")
  const [editorKey, setEditorKey] = useState(0)
  const [result, setResult] = useState<ActionResponse<boolean> | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const clearEditorRef = useRef<(() => void) | null>(null)

  async function handleSubmit(evt: React.SubmitEvent<HTMLFormElement>) {
    evt.preventDefault()
    const formData = new FormData(evt.target)
    const title = formData.get("title") as string
    const spotifyPlaylistUrl = formData.get("spotifyPlaylistUrl") as string

    startTransition(async () => {
      const res = await createNewsletter({ title, spotifyPlaylistUrl, blurb })
      setResult(res)
      if (!res.error) {
        formRef.current?.reset()
        clearEditorRef.current?.()
        setEditorKey((k) => k + 1)
        setBlurb("")
      }
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="title">
          Title <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          type="text"
          id="title"
          name="title"
          placeholder="e.g. Late night drives — defaults to Songs I'm Listening To"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="spotifyPlaylistUrl">Spotify Playlist URL</Label>
        <Input
          type="url"
          id="spotifyPlaylistUrl"
          name="spotifyPlaylistUrl"
          placeholder="https://open.spotify.com/playlist/..."
        />
      </div>

      <div className="space-y-1.5">
        <Label>Blurb</Label>
        <TiptapEditor
          key={editorKey}
          onChange={setBlurb}
          onReady={(clear) => {
            clearEditorRef.current = clear
          }}
        />
      </div>

      {result && (
        <p
          className={
            !result.error
              ? "text-sm text-green-700"
              : "text-sm text-destructive"
          }
        >
          {!result.error ? "Newsletter created." : result.error.message}
        </p>
      )}

      <Button type="submit" disabled={isPending}>
        Create Newsletter
      </Button>
    </form>
  )
}
