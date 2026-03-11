import * as v from "valibot"

export const SubscribeSchema = v.object({
  email: v.pipe(v.string(), v.nonEmpty(), v.email()),
})

export const UnsubscribeSchema = v.object({
  token: v.pipe(v.string(), v.nonEmpty()),
})

export const CreateNewsletterSchema = v.object({
  title: v.optional(v.pipe(v.string(), v.trim())),
  spotifyPlaylistUrl: v.pipe(v.string(), v.nonEmpty(), v.url()),
  blurb: v.pipe(v.string(), v.nonEmpty()),
})
