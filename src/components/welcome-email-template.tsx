import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Text,
} from "@react-email/components"

import { NEWSLETTER_NAME } from "@/lib/constants"
import { theme } from "@/lib/colors"

const { primary, accent, muted, divider, bg } = theme

export const WelcomeEmailTemplate = () => {
  return (
    <Html lang="en">
      <Head />
      <Body style={{ backgroundColor: bg, fontFamily: "sans-serif" }}>
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
            Welcome aboard!
          </Heading>

          <Hr style={{ borderColor: divider, margin: "24px 0" }} />

          <Text
            style={{ fontSize: "15px", lineHeight: "1.7", color: primary }}
          >
            Thank you for signing up — keep an eye on your inbox this Friday
            for your first newsletter. I hope you enjoy the songs!
          </Text>

          <Hr style={{ borderColor: divider, margin: "36px 0 16px" }} />

          <Text style={{ fontSize: "12px", color: muted, lineHeight: "1.6" }}>
            You&apos;re receiving this because you subscribed to {NEWSLETTER_NAME}.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
