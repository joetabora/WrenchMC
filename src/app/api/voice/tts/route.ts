// ElevenLabs Text-to-Speech API endpoint
import { NextRequest, NextResponse } from 'next/server'
import { textToSpeech } from '@/lib/elevenlabs'

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId, modelId } = await req.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Generate speech using ElevenLabs
    const audioBuffer = await textToSpeech(text, {
      voiceId,
      modelId,
      stability: 0.5,
      similarityBoost: 0.75,
      style: 0.0,
      useSpeakerBoost: true,
    })

    if (!audioBuffer) {
      return NextResponse.json(
        { error: 'Failed to generate speech. ElevenLabs API key may not be configured.' },
        { status: 500 }
      )
    }

    // Return audio as binary response
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error: any) {
    console.error('TTS API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate speech' },
      { status: 500 }
    )
  }
}

