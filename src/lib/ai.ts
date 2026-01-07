// AI integration for WrenchMC Goliath
// Supports Groq AI and Google Gemini

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIResponse {
  answer: string
  sources?: string[]
}

// Groq AI integration (fast inference)
export async function queryGroq(
  messages: AIMessage[],
  systemPrompt?: string
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('GROQ_API_KEY not configured')
  }

  const allMessages = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile', // Updated to current model
      messages: allMessages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Groq API error: ${error}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || 'No response from AI'
}

// Google Gemini integration (alternative/fallback)
export async function queryGemini(
  messages: AIMessage[],
  systemPrompt?: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured')
  }

  // Convert messages to Gemini format
  const contents = messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }))

  // Add system prompt as first user message if provided
  const geminiContents = systemPrompt
    ? [{ role: 'user', parts: [{ text: systemPrompt }] }, ...contents]
    : contents

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/${process.env.GEMINI_MODEL || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: geminiContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini API error: ${error}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI'
}

// Smart AI query - tries Groq first, falls back to Gemini
export async function queryAI(
  messages: AIMessage[],
  systemPrompt?: string
): Promise<string> {
  // Try Groq first (faster)
  if (process.env.GROQ_API_KEY) {
    try {
      return await queryGroq(messages, systemPrompt)
    } catch (error) {
      console.warn('Groq API failed, trying Gemini:', error)
      // Fall through to Gemini
    }
  }

  // Fallback to Gemini
  if (process.env.GEMINI_API_KEY) {
    return await queryGemini(messages, systemPrompt)
  }

  throw new Error('No AI API key configured. Add GROQ_API_KEY or GEMINI_API_KEY')
}

// RAG-enhanced query with context from embeddings
export async function queryAIWithRAG(
  userQuery: string,
  context: string[] = []
): Promise<{ answer: string; sources: string[] }> {
  const systemPrompt = `You are WrenchMC Goliath, an expert Harley-Davidson mechanic and technical advisor. 
You have access to a comprehensive database of Harley-Davidson specifications, repair procedures, and community knowledge.
Always provide accurate, cited information. If you're unsure, say so clearly.

Context from database:
${context.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Answer the user's question based on the context provided. Cite specific sources when possible.`

  const answer = await queryAI(
    [{ role: 'user', content: userQuery }],
    systemPrompt
  )

  return {
    answer,
    sources: context,
  }
}

