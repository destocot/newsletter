"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Bold, Italic, List } from "lucide-react"

import { cn } from "@/lib/utils"

interface TiptapEditorProps {
  content?: string
  onChange: (html: string) => void
  onReady?: (clear: () => void) => void
}

export const TiptapEditor = ({ content, onChange, onReady }: TiptapEditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    content,
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class:
          "tiptap-content min-h-32 px-3 py-2 text-sm focus:outline-none",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    onCreate({ editor }) {
      onReady?.(() => editor.commands.clearContent())
    },
  })

  const tools = [
    {
      label: "Bold",
      icon: Bold,
      action: () => editor?.chain().focus().toggleBold().run(),
      active: () => !!editor?.isActive("bold"),
    },
    {
      label: "Italic",
      icon: Italic,
      action: () => editor?.chain().focus().toggleItalic().run(),
      active: () => !!editor?.isActive("italic"),
    },
    {
      label: "Bullet list",
      icon: List,
      action: () => editor?.chain().focus().toggleBulletList().run(),
      active: () => !!editor?.isActive("bulletList"),
    },
  ]

  return (
    <div className="rounded-md border border-input overflow-hidden">
      <div className="flex gap-0.5 border-b border-input bg-muted/50 px-1.5 py-1">
        {tools.map(({ label, icon: Icon, action, active }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            onClick={action}
            className={cn(
              "p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
              active() && "bg-accent text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
