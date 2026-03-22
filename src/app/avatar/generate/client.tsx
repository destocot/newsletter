"use client"

import { useEffect, useRef, useState } from "react"

const BG_COLOR = "rgb(43, 80, 55)"
const CANVAS_SIZE = 1080
const HALF = CANVAS_SIZE / 2
const LETTERS: [string, string, number, number][] = [
  ["S", "ongs", HALF / 2, HALF / 2],
  ["I", "'m", HALF + HALF / 2, HALF / 2],
  ["L", "istening", HALF / 2, HALF + HALF / 2],
  ["T", "o", HALF + HALF / 2, HALF + HALF / 2],
]

function drawCanvas(canvas: HTMLCanvasElement, number: string) {
  const ctx = canvas.getContext("2d")!

  // Background
  ctx.fillStyle = BG_COLOR
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

  // Subtle grid lines
  ctx.strokeStyle = "rgba(255,255,255,0.08)"
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(HALF, 0)
  ctx.lineTo(HALF, CANVAS_SIZE)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(0, HALF)
  ctx.lineTo(CANVAS_SIZE, HALF)
  ctx.stroke()

  // Letters + sub-word
  for (const [letter, rest, x, y] of LETTERS) {
    // Big letter
    ctx.fillStyle = "rgba(255,255,255,0.92)"
    ctx.font = "bold 330px system-ui, -apple-system, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    const letterW = ctx.measureText(letter).width

    // Measure sub-word to position inline after letter
    ctx.font = "300 72px system-ui, -apple-system, sans-serif"
    const restW = ctx.measureText(rest).width
    const totalW = letterW + 16 + restW
    const startX = x - totalW / 2

    // Draw big letter
    ctx.font = "bold 330px system-ui, -apple-system, sans-serif"
    ctx.textAlign = "left"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "rgba(255,255,255,0.92)"
    ctx.fillText(letter, startX, y)

    // Draw rest of word aligned to baseline of letter
    ctx.font = "300 72px system-ui, -apple-system, sans-serif"
    ctx.fillStyle = "rgba(255,255,255,0.55)"
    ctx.fillText(rest, startX + letterW + 16, y + 80)
  }

  // Number badge in center
  if (number.trim()) {
    const label = number.trim()
    ctx.font = "600 100px system-ui, -apple-system, sans-serif"
    const metrics = ctx.measureText(label)
    const padX = 40
    const pillH = 150
    const pillW = Math.max(metrics.width + padX * 2, pillH)
    const pillX = HALF - pillW / 2
    const pillY = HALF - pillH / 2
    const r = pillH / 2

    // Pill background
    ctx.fillStyle = "rgba(0,0,0,0.35)"
    ctx.beginPath()
    ctx.moveTo(pillX + r, pillY)
    ctx.lineTo(pillX + pillW - r, pillY)
    ctx.arcTo(pillX + pillW, pillY, pillX + pillW, pillY + r, r)
    ctx.lineTo(pillX + pillW, pillY + pillH - r)
    ctx.arcTo(pillX + pillW, pillY + pillH, pillX + pillW - r, pillY + pillH, r)
    ctx.lineTo(pillX + r, pillY + pillH)
    ctx.arcTo(pillX, pillY + pillH, pillX, pillY + pillH - r, r)
    ctx.lineTo(pillX, pillY + r)
    ctx.arcTo(pillX, pillY, pillX + r, pillY, r)
    ctx.closePath()
    ctx.fill()

    // Number text
    ctx.fillStyle = "rgba(255,255,255,0.95)"
    ctx.font = "600 100px system-ui, -apple-system, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(label, HALF, HALF)
  }
}

export function AvatarGenerateClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [number, setNumber] = useState("")

  useEffect(() => {
    if (canvasRef.current) drawCanvas(canvasRef.current, number)
  }, [number])

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement("a")
    link.download = `silt-${number || "cover"}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return (
    <main className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center gap-6 px-8 py-16">
      <div
        className="overflow-hidden shadow-2xl"
        style={{ width: 540, height: 540 }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          style={{ width: 540, height: 540, display: "block" }}
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Issue number…"
          className="bg-neutral-800 text-white placeholder-neutral-500 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-white/20"
        />
        <button
          onClick={handleDownload}
          className="bg-white text-black text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-neutral-200 transition-colors"
        >
          Download PNG
        </button>
      </div>
    </main>
  )
}
