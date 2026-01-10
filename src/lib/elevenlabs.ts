// ElevenLabs Text-to-Speech API integration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1'

export interface ElevenLabsConfig {
  voiceId?: string // Default voice ID if not provided
  modelId?: string // Default to 'eleven_multilingual_v2' or 'eleven_turbo_v2_5'
  stability?: number // 0.0 to 1.0
  similarityBoost?: number // 0.0 to 1.0
  style?: number // 0.0 to 1.0
  useSpeakerBoost?: boolean
}

export async function textToSpeech(
  text: string,
  config: ElevenLabsConfig = {}
): Promise<ArrayBuffer | null> {
  if (!ELEVENLABS_API_KEY) {
    console.warn('ELEVENLABS_API_KEY not configured')
    return null
  }

  try {
    // Default voice ID (Rachel - a popular choice)
    // You can change this to any voice ID from your ElevenLabs account
    const voiceId = config.voiceId || process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM' // Rachel
    // Using multilingual_v2 instead of turbo for clearer, slower speech (less word mixing)
    const modelId = config.modelId || process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2'
    
    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text.substring(0, 5000), // Limit text length (ElevenLabs limit)
          model_id: modelId,
          voice_settings: {
            stability: config.stability ?? 0.5,
            similarity_boost: config.similarityBoost ?? 0.75,
            style: config.style ?? 0.0,
            use_speaker_boost: config.useSpeakerBoost ?? true,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `ElevenLabs API error: ${response.status} ${errorData.detail?.message || response.statusText}`
      )
    }

    return await response.arrayBuffer()
  } catch (error) {
    console.error('ElevenLabs TTS error:', error)
    return null
  }
}

export async function getVoices(): Promise<any[]> {
  if (!ELEVENLABS_API_KEY) {
    return []
  }

  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`)
    }

    const data = await response.json()
    return data.voices || []
  } catch (error) {
    console.error('ElevenLabs get voices error:', error)
    return []
  }
}

