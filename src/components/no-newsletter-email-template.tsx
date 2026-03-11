import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Text,
} from "@react-email/components"

const accent = "#1a7a3f"
const muted = "#5c7a68"
const primary = "#1a2e22"
const divider = "#cde0d5"

export const NoNewsletterEmailTemplate = () => {
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
              marginBottom: "4px",
              marginTop: "0",
            }}
          >
            Songs I&apos;m Listening To
          </Heading>

          <Text style={{ color: muted, fontSize: "13px", marginTop: "0" }}>
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Text>

          <Hr style={{ borderColor: divider, margin: "24px 0" }} />

          <Text
            style={{ fontSize: "15px", lineHeight: "1.7", color: primary }}
          >
            Sorry, no new newsletter this week — either I didn&apos;t have
            enough songs to share or I&apos;m running a little late. Stay tuned
            for next week!
          </Text>

          <Hr style={{ borderColor: divider, margin: "36px 0 16px" }} />

          <Text style={{ fontSize: "12px", color: muted, lineHeight: "1.6" }}>
            You&apos;re receiving this because you subscribed to Songs I&apos;m
            Listening To.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
