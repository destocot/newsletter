import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Section,
  Text,
} from "@react-email/components"

import { NEWSLETTER_NAME } from "@/lib/constants"

import { SpotifyTrack } from "@/lib/spotify"

interface EmailTemplateProps {
  title?: string | null
  blurb: string
  spotifyPlaylistUrl: string
  tracks: SpotifyTrack[]
  unsubscribeUrl: string
  issueNumber: number
}

const accent = "#1a7a3f"
const muted = "#5c7a68"
const primary = "#1a2e22"
const divider = "#cde0d5"

export const EmailTemplate = ({
  title,
  blurb,
  spotifyPlaylistUrl,
  tracks,
  unsubscribeUrl,
  issueNumber,
}: EmailTemplateProps) => {
  return (
    <Html lang="en">
      <Head />
      <Body style={{ backgroundColor: "#f2f8f4", fontFamily: "sans-serif" }}>
        <Container
          style={{ maxWidth: "560px", margin: "0 auto", padding: "48px 24px" }}
        >
          <Text
            style={{
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: accent,
              marginBottom: "12px",
            }}
          >
            ♪ &nbsp; Khurram&apos;s Newsletter
          </Text>

          <Heading
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: primary,
              marginBottom: title ? "6px" : "4px",
              marginTop: "0",
            }}
          >
            {NEWSLETTER_NAME} No. {issueNumber}
          </Heading>

          {title && (
            <Text
              style={{
                fontSize: "16px",
                color: muted,
                marginTop: "0",
                marginBottom: "4px",
                fontStyle: "italic",
              }}
            >
              {title}
            </Text>
          )}

          <Text style={{ color: muted, fontSize: "13px", marginTop: "0" }}>
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Text>

          <Hr style={{ borderColor: divider, margin: "24px 0" }} />

          {tracks.length > 0 && (
            <>
              <Heading
                as="h2"
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: muted,
                  marginBottom: "16px",
                  marginTop: "0",
                }}
              >
                This Week&apos;s Playlist
              </Heading>

              <Section>
                {tracks.map((track, i) => (
                  <Text
                    key={track.url}
                    style={{
                      fontSize: "14px",
                      margin: "8px 0",
                      lineHeight: "1.5",
                      color: primary,
                    }}
                  >
                    <span style={{ color: accent, marginRight: "8px", fontWeight: "600" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Link
                      href={track.url}
                      style={{ color: primary, textDecoration: "none", fontWeight: "500" }}
                    >
                      {track.name}
                    </Link>
                    <span style={{ color: muted }}>
                      {" "}— {track.artists.join(", ")}
                    </span>
                  </Text>
                ))}
              </Section>

              <Section style={{ marginTop: "24px" }}>
                <Link
                  href={spotifyPlaylistUrl}
                  style={{
                    backgroundColor: accent,
                    color: "#ffffff",
                    padding: "10px 22px",
                    borderRadius: "9999px",
                    fontSize: "13px",
                    fontWeight: "600",
                    textDecoration: "none",
                    display: "inline-block",
                    letterSpacing: "0.02em",
                  }}
                >
                  Open Full Playlist →
                </Link>
              </Section>

              <Hr style={{ borderColor: divider, margin: "28px 0" }} />
            </>
          )}

          {/* Blurb — rendered from Tiptap HTML */}
          <div
            dangerouslySetInnerHTML={{ __html: blurb }}
            style={{ fontSize: "15px", lineHeight: "1.7", color: primary }}
          />

          <Hr style={{ borderColor: divider, margin: "36px 0 16px" }} />

          <Text style={{ fontSize: "12px", color: muted, lineHeight: "1.6" }}>
            You&apos;re receiving this because you subscribed to {NEWSLETTER_NAME}.{" "}
            <Link href={unsubscribeUrl} style={{ color: muted }}>
              Unsubscribe
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
