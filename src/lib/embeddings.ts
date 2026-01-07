// Vector embeddings for RAG (Retrieval Augmented Generation)
// Using Hugging Face Inference API for embeddings

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY
const EMBEDDING_MODEL = 'sentence-transformers/all-MiniLM-L6-v2'

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!HF_API_KEY) {
    console.warn('HUGGINGFACE_API_KEY not configured, skipping embedding')
    return []
  }

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/pipeline/feature-extraction/${EMBEDDING_MODEL}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text }),
      }
    )

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data[0] : data
  } catch (error) {
    console.error('Embedding generation error:', error)
    return []
  }
}

// Alternative: Use OpenAI embeddings (more reliable, but costs money)
export async function generateEmbeddingOpenAI(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured')
  }

  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data[0].embedding
  } catch (error) {
    console.error('OpenAI embedding error:', error)
    return []
  }
}

// Store embedding in Pinecone (if configured)
export async function storeEmbedding(
  text: string,
  sourceType: string,
  sourceId: string,
  metadata?: Record<string, any>
): Promise<string | null> {
  const pineconeApiKey = process.env.PINECONE_API_KEY
  const pineconeIndex = process.env.PINECONE_INDEX_NAME

  if (!pineconeApiKey || !pineconeIndex) {
    console.warn('Pinecone not configured, skipping vector storage')
    return null
  }

  try {
    const embedding = await generateEmbeddingOpenAI(text).catch(() =>
      generateEmbedding(text)
    )

    if (embedding.length === 0) {
      return null
    }

    // Use Pinecone SDK if available, otherwise fallback to REST API
    try {
      const { getPineconeIndex } = await import('./pinecone')
      const index = await getPineconeIndex()
      
      if (index) {
        await index.upsert([
          {
            id: `${sourceType}_${sourceId}`,
            values: embedding,
            metadata: {
              text,
              sourceType,
              sourceId,
              ...metadata,
            },
          },
        ])
        return `${sourceType}_${sourceId}`
      }
    } catch (sdkError) {
      console.warn('Pinecone SDK failed, using REST API fallback:', sdkError)
    }

    // Fallback to REST API (for older Pinecone setups)
    const environment = process.env.PINECONE_ENVIRONMENT || 'us-east-1'
    const response = await fetch(
      `https://${pineconeIndex}.svc.${environment}.pinecone.io/vectors/upsert`,
      {
        method: 'POST',
        headers: {
          'Api-Key': pineconeApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vectors: [
            {
              id: `${sourceType}_${sourceId}`,
              values: embedding,
              metadata: {
                text,
                sourceType,
                sourceId,
                ...metadata,
              },
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Pinecone error: ${response.statusText} - ${errorText}`)
    }

    return `${sourceType}_${sourceId}`
  } catch (error) {
    console.error('Pinecone storage error:', error)
    return null
  }
}

// Search similar content using embeddings
export async function searchSimilarContent(
  query: string,
  topK: number = 5
): Promise<Array<{ text: string; sourceType: string; sourceId: string; score: number }>> {
  const pineconeApiKey = process.env.PINECONE_API_KEY
  const pineconeIndex = process.env.PINECONE_INDEX_NAME

  if (!pineconeApiKey || !pineconeIndex) {
    return []
  }

  try {
    const queryEmbedding = await generateEmbeddingOpenAI(query).catch(() =>
      generateEmbedding(query)
    )

    if (queryEmbedding.length === 0) {
      return []
    }

    // Use Pinecone SDK if available, otherwise fallback to REST API
    try {
      const { getPineconeIndex } = await import('./pinecone')
      const index = await getPineconeIndex()
      
      if (index) {
        const queryResponse = await index.query({
          vector: queryEmbedding,
          topK,
          includeMetadata: true,
        })

        return (
          queryResponse.matches?.map((match: any) => ({
            text: match.metadata?.text || '',
            sourceType: match.metadata?.sourceType || '',
            sourceId: match.metadata?.sourceId || '',
            score: match.score || 0,
          })) || []
        )
      }
    } catch (sdkError) {
      console.warn('Pinecone SDK failed, using REST API fallback:', sdkError)
    }

    // Fallback to REST API (for older Pinecone setups)
    const environment = process.env.PINECONE_ENVIRONMENT || 'us-east-1'
    const response = await fetch(
      `https://${pineconeIndex}.svc.${environment}.pinecone.io/query`,
      {
        method: 'POST',
        headers: {
          'Api-Key': pineconeApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vector: queryEmbedding,
          topK,
          includeMetadata: true,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Pinecone query error: ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    return (
      data.matches?.map((match: any) => ({
        text: match.metadata?.text || '',
        sourceType: match.metadata?.sourceType || '',
        sourceId: match.metadata?.sourceId || '',
        score: match.score || 0,
      })) || []
    )
  } catch (error) {
    console.error('Pinecone search error:', error)
    return []
  }
}

