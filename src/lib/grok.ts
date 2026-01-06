// xAI Grok API integration for AI-powered queries
// Grok API endpoint: https://api.x.ai/v1/chat/completions

export interface GrokMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface GrokResponse {
  id: string
  choices: Array<{
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export async function queryGrok(
  messages: GrokMessage[],
  systemPrompt?: string
): Promise<string> {
  const apiKey = process.env.XAI_API_KEY
  if (!apiKey) {
    throw new Error('XAI_API_KEY not configured')
  }

  const allMessages = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: allMessages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Grok API error: ${error}`)
  }

  const data: GrokResponse = await response.json()
  return data.choices[0]?.message?.content || 'No response from AI'
}

// RAG-enhanced query with context from embeddings
export async function queryGrokWithRAG(
  userQuery: string,
  context: string[] = []
): Promise<{ answer: string; sources: string[] }> {
  const systemPrompt = `You are WrenchMC Goliath, an expert Harley-Davidson mechanic and technical advisor. 
You have access to a comprehensive database of Harley-Davidson specifications, repair procedures, and community knowledge.
Always provide accurate, cited information. If you're unsure, say so clearly.

Context from database:
${context.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Answer the user's question based on the context provided. Cite specific sources when possible.`

  const answer = await queryGrok(
    [{ role: 'user', content: userQuery }],
    systemPrompt
  )

  return {
    answer,
    sources: context,
  }
}

