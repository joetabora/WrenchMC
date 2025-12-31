import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { sourceText } = await req.json()

    if (!sourceText || typeof sourceText !== 'string') {
      return NextResponse.json({ error: 'Source text is required' }, { status: 400 })
    }

    // Check for API keys - prefer OpenRouter (free options), fallback to OpenAI
    const openRouterKey = process.env.OPENROUTER_API_KEY
    const openaiApiKey = process.env.OPENAI_API_KEY
    
    if (!openRouterKey && !openaiApiKey) {
      return NextResponse.json({ 
        error: 'No AI API key configured. Add OPENROUTER_API_KEY (recommended for free models) or OPENAI_API_KEY to your environment variables.' 
      }, { status: 500 })
    }

    // Use OpenRouter if available (has free models), otherwise OpenAI
    const useOpenRouter = !!openRouterKey
    const apiKey = openRouterKey || openaiApiKey
    const apiUrl = useOpenRouter 
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions'
    
    // Choose model - OpenRouter free models or OpenAI
    // OpenRouter free models: google/gemini-2.0-flash-exp:free, meta-llama/llama-3.2-3b-instruct:free, etc.
    const model = useOpenRouter
      ? (process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free') // Free model
      : (process.env.OPENAI_MODEL || 'gpt-4o-mini')

    // Call AI API to extract specs
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        ...(useOpenRouter && {
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://wrenchmc.vercel.app',
          'X-Title': 'WrenchMC Spec Import'
        })
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: `You are a technical data extraction assistant. Extract Harley-Davidson motorcycle technical specifications from the provided text.

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
          },
          {
            role: 'user',
            content: sourceText
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent extraction
        response_format: { type: 'json_object' }
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json({ 
        error: `AI API error: ${error.error?.message || error.message || 'Unknown error'}` 
      }, { status: 500 })
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    // Parse the JSON response
    let parsed
    try {
      parsed = JSON.parse(content)
      // Handle if OpenAI wraps it in an object
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

