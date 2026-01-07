// Pinecone client wrapper using official SDK
import { Pinecone } from '@pinecone-database/pinecone'

let pineconeClient: Pinecone | null = null

export function getPineconeClient(): Pinecone | null {
  if (!process.env.PINECONE_API_KEY) {
    return null
  }

  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    })
  }

  return pineconeClient
}

export async function getPineconeIndex() {
  const client = getPineconeClient()
  if (!client || !process.env.PINECONE_INDEX_NAME) {
    return null
  }

  return client.index(process.env.PINECONE_INDEX_NAME)
}

