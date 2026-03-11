import { env } from "@/lib/env.server"

export interface SpotifyTrack {
  name: string
  artists: string[]
  url: string
}

function extractPlaylistId(playlistUrl: string): string | null {
  const match = playlistUrl.match(/playlist\/([a-zA-Z0-9]+)/)
  return match ? match[1] : null
}

async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64")

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  const data = await res.json()
  return data.access_token as string
}

export async function getPlaylistTracks(
  playlistUrl: string,
): Promise<SpotifyTrack[]> {
  const playlistId = extractPlaylistId(playlistUrl)
  if (!playlistId) return []

  const token = await getAccessToken()

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50&fields=items(track(name,artists(name),external_urls))`,
    { headers: { Authorization: `Bearer ${token}` } },
  )

  const data = await res.json()

  return (
    data.items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ?.filter((item: any) => item.track)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => ({
        name: item.track.name,
        artists: item.track.artists.map((a: { name: string }) => a.name),
        url: item.track.external_urls.spotify,
      })) ?? []
  )
}
