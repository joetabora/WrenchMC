// YouTube Data API integration for tutorials
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3'

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  channelTitle: string
  channelId: string
  publishedAt: string
  duration: string
  viewCount: string
  likeCount?: string
}

export async function searchYouTubeVideos(
  query: string,
  maxResults: number = 10
): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    console.warn('YOUTUBE_API_KEY not configured')
    return []
  }

  try {
    const searchResponse = await fetch(
      `${YOUTUBE_API_URL}/search?part=snippet&q=${encodeURIComponent(
        query
      )}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
    )

    if (!searchResponse.ok) {
      throw new Error('YouTube API search failed')
    }

    const searchData = await searchResponse.json()
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',')

    // Get detailed video info including duration
    const detailsResponse = await fetch(
      `${YOUTUBE_API_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    )

    if (!detailsResponse.ok) {
      throw new Error('YouTube API details failed')
    }

    const detailsData = await detailsResponse.json()

    return detailsData.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      channelTitle: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      publishedAt: item.snippet.publishedAt,
      duration: parseDuration(item.contentDetails.duration),
      viewCount: item.statistics.viewCount,
      likeCount: item.statistics.likeCount,
    }))
  } catch (error) {
    console.error('YouTube API error:', error)
    return []
  }
}

function parseDuration(duration: string): string {
  // Parse ISO 8601 duration (e.g., PT4M13S) to readable format
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return duration

  const hours = match[1] ? `${match[1]}:` : ''
  const minutes = match[2] || '0'
  const seconds = match[3]?.padStart(2, '0') || '00'

  return hours ? `${hours}${minutes}:${seconds}` : `${minutes}:${seconds}`
}

export async function getChannelVideos(
  channelId: string,
  maxResults: number = 20
): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) return []

  try {
    const response = await fetch(
      `${YOUTUBE_API_URL}/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
    )

    if (!response.ok) return []

    const data = await response.json()
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      channelTitle: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      publishedAt: item.snippet.publishedAt,
      duration: '',
      viewCount: '0',
    }))
  } catch (error) {
    console.error('YouTube channel fetch error:', error)
    return []
  }
}

