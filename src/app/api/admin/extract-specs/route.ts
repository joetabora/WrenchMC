import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { sourceText } = await req.json()

    if (!sourceText || typeof sourceText !== 'string') {
      return NextResponse.json({ error: 'Source text is required' }, { status: 400 })
    }

    // Check for API keys - prefer Groq (fast), then Gemini, fallback to OpenAI
    const groqApiKey = process.env.GROQ_API_KEY
    const geminiApiKey = process.env.GEMINI_API_KEY
    const openaiApiKey = process.env.OPENAI_API_KEY
    
    if (!groqApiKey && !geminiApiKey && !openaiApiKey) {
      return NextResponse.json({ 
        error: 'No AI API key configured. Add GROQ_API_KEY (recommended), GEMINI_API_KEY, or OPENAI_API_KEY to your environment variables.' 
      }, { status: 500 })
    }

    // Prepare system prompt
    const systemPrompt = `You are a technical data extraction assistant. Extract Harley-Davidson motorcycle technical specifications from the provided text.

Extract all torque specifications, bolt sizes, and related technical information. Return a JSON object with a "specs" array containing objects with this exact structure:

{
  "specs": [
    {
      "component_name": "string (required)",
      "torque_spec_low": number or null,
      "torque_spec_high": number or null,
      "bolt_size": "string or null",
      "sequence_notes": "string or null (tightening sequence, pattern, etc.)",
      "applicable_years": ["array", "of", "years"] or [],
      "applicable_models": ["array", "of", "models"] or [],
      "source_notes": "string or null (where this info came from)"
    }
  ]
}

Rules:
- Extract ALL specs found in the text
- If torque is a range (e.g., "20-25 Nm"), set torque_spec_low to 20 and torque_spec_high to 25
- If torque is a single value, set torque_spec_low to that value and torque_spec_high to null
- Convert all torque values to Newton-meters (Nm) - if given in ft-lbs, convert (1 ft-lb = 1.356 Nm)
- Extract bolt sizes exactly as written (M8, 1/4-20, etc.)
- Extract tightening sequences/patterns if mentioned
- Try to infer applicable years/models from context if mentioned
- Return empty specs array if no specs found
- Return ONLY valid JSON, no other text`

    let content: string

    // Use Groq if available (fastest), then Gemini, fallback to OpenAI
    if (groqApiKey) {
      // Groq API (OpenAI-compatible)
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || 'llama-3.1-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: sourceText }
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' }
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        return NextResponse.json({ 
          error: `Groq API error: ${error.error?.message || error.message || 'Unknown error'}` 
        }, { status: 500 })
      }

      const data = await response.json()
      content = data.choices[0]?.message?.content || ''
    } else if (geminiApiKey) {
      // Google Gemini API
      const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash'
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: systemPrompt },
                  { text: sourceText }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 2000,
              responseMimeType: 'application/json',
            },
          }),
        }
      )

      if (!response.ok) {
        const error = await response.text()
        return NextResponse.json({ 
          error: `Gemini API error: ${error}` 
        }, { status: 500 })
      }

      const data = await response.json()
      content = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    } else {
      // OpenAI API (fallback)
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: sourceText }
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' }
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        return NextResponse.json({ 
          error: `OpenAI API error: ${error.error?.message || error.message || 'Unknown error'}` 
        }, { status: 500 })
      }

      const data = await response.json()
      content = data.choices[0]?.message?.content || ''
    }

    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    // Parse the JSON response
    let parsed
    try {
      parsed = JSON.parse(content)
      // Handle if AI wraps it in an object
      const specs = parsed.specs || parsed.data || (Array.isArray(parsed) ? parsed : [])
      
      if (!Array.isArray(specs)) {
        return NextResponse.json({ error: 'Invalid response format from AI' }, { status: 500 })
      }

      // Validate and clean the specs
      const cleanedSpecs = specs
        .filter((spec: any) => spec.component_name) // Must have component name
        .map((spec: any) => ({
          component_name: spec.component_name?.trim() || '',
          torque_spec_low: spec.torque_spec_low ? parseFloat(spec.torque_spec_low) : null,
          torque_spec_high: spec.torque_spec_high ? parseFloat(spec.torque_spec_high) : null,
          bolt_size: spec.bolt_size?.trim() || null,
          sequence_notes: spec.sequence_notes?.trim() || null,
          applicable_years: Array.isArray(spec.applicable_years) ? spec.applicable_years : [],
          applicable_models: Array.isArray(spec.applicable_models) ? spec.applicable_models : [],
          source_notes: spec.source_notes?.trim() || null,
        }))

      return NextResponse.json({ 
        specs: cleanedSpecs,
        count: cleanedSpecs.length 
      })
    } catch (parseError) {
      return NextResponse.json({ 
        error: `Failed to parse AI response: ${parseError}`,
        rawResponse: content 
      }, { status: 500 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error extracting specs' }, { status: 500 })
  }
}
