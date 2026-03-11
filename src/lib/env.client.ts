import * as v from "valibot"

const clientEnvSchema = v.object({
  NEXT_PUBLIC_BASE_URL: v.pipe(
    v.string(),
    v.url("NEXT_PUBLIC_BASE_URL must be a valid URL"),
  ),
})

export const env = v.parse(clientEnvSchema, {
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
})
