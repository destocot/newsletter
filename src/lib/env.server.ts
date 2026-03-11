import * as v from "valibot"

const serverEnvSchema = v.object({
  DATABASE_URL: v.pipe(v.string(), v.minLength(1, "DATABASE_URL is required")),
  NEXT_PUBLIC_BASE_URL: v.pipe(
    v.string(),
    v.url("NEXT_PUBLIC_BASE_URL must be a valid URL"),
  ),
  RESEND_API_KEY: v.pipe(
    v.string(),
    v.minLength(1, "RESEND_API_KEY is required"),
  ),
  SPOTIFY_CLIENT_ID: v.pipe(
    v.string(),
    v.minLength(1, "SPOTIFY_CLIENT_ID is required"),
  ),
  SPOTIFY_CLIENT_SECRET: v.pipe(
    v.string(),
    v.minLength(1, "SPOTIFY_CLIENT_SECRET is required"),
  ),
  ADMIN_TEST_EMAIL: v.pipe(
    v.string(),
    v.email("ADMIN_TEST_EMAIL must be a valid email"),
  ),
  CRON_SECRET: v.pipe(v.string(), v.minLength(1, "CRON_SECRET is required")),
})

export const env = v.parse(serverEnvSchema, {
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  ADMIN_TEST_EMAIL: process.env.ADMIN_TEST_EMAIL,
  CRON_SECRET: process.env.CRON_SECRET,
})
