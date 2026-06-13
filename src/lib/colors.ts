type Palette = {
  primary: string
  accent: string
  muted: string
  divider: string
  bg: string
  avatarBg: string
}

export const colors: Record<string, Palette> = {
  // hue ~143°
  green: {
    primary: "#1a2e22",
    accent: "#1a7a3f",
    muted: "#5c7a68",
    divider: "#cde0d5",
    bg: "#f2f8f4",
    avatarBg: "rgb(43, 80, 55)",
  },
  // hue ~240° (+97°)
  blue: {
    primary: "#1a1a2e",
    accent: "#1a1a7a",
    muted: "#5c5c7a",
    divider: "#cdcde0",
    bg: "#f2f2f8",
    avatarBg: "rgb(43, 44, 80)",
  },
  // hue ~280° (+137°)
  purple: {
    primary: "#281a2e",
    accent: "#5a1a7a",
    muted: "#715c7a",
    divider: "#dacde0",
    bg: "#f6f2f8",
    avatarBg: "rgb(65, 43, 80)",
  },
  // hue ~0° (+217°)
  red: {
    primary: "#2e1a1a",
    accent: "#7a1a1a",
    muted: "#7a5c5c",
    divider: "#e0cdcd",
    bg: "#f8f2f2",
    avatarBg: "rgb(80, 43, 45)",
  },
  // hue ~30° (+247°)
  orange: {
    primary: "#2e241a",
    accent: "#7a4a1a",
    muted: "#7a6b5c",
    divider: "#e0d7cd",
    bg: "#f8f5f2",
    avatarBg: "rgb(80, 59, 43)",
  },
  // hue ~330° (+187°)
  pink: {
    primary: "#2e1a24",
    accent: "#7a1a4a",
    muted: "#7a5c6b",
    divider: "#e0cdd6",
    bg: "#f8f2f5",
    avatarBg: "rgb(80, 43, 64)",
  },
}

export const theme = colors[process.env.NEXT_PUBLIC_THEME ?? "green"] ?? colors.green
