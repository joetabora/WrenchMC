// Script to populate Pinecone with embeddings from database
// Run with: npm run populate-pinecone

// Load environment variables first
import dotenv from 'dotenv'
import { resolve } from 'path'

// Load .env.local file
dotenv.config({ path: resolve(__dirname, '../.env.local') })

// Set DATABASE_URL for Prisma if PRISMA_DATABASE_URL is set
if (process.env.PRISMA_DATABASE_URL && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.PRISMA_DATABASE_URL
}

import { prisma } from '../src/lib/prisma'
import { generateEmbedding, generateEmbeddingOpenAI, storeEmbedding } from '../src/lib/embeddings'

async function populatePinecone() {
  console.log('🚀 Starting Pinecone population...\n')

  // Check if Pinecone is configured
  if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX_NAME) {
    console.error('❌ Pinecone not configured!')
    console.error('Please set PINECONE_API_KEY and PINECONE_INDEX_NAME in .env.local')
    process.exit(1)
  }

  // Check if embeddings provider is configured
  const hasHF = !!process.env.HUGGINGFACE_API_KEY
  const hasOpenAI = !!process.env.OPENAI_API_KEY

  if (!hasHF && !hasOpenAI) {
    console.error('❌ No embedding provider configured!')
    console.error('')
    console.error('You need ONE embedding provider to create vectors:')
    console.error('  - HUGGINGFACE_API_KEY (free tier, recommended to start)')
    console.error('  - OR OPENAI_API_KEY (paid, more reliable)')
    console.error('')
    console.error('Pinecone stores vectors, but you need a provider to CREATE them.')
    console.error('See EMBEDDING_PROVIDER_SETUP.md for setup instructions.')
    process.exit(1)
  }

  console.log('✅ Configuration check passed')
  console.log(`   Using: ${hasOpenAI ? 'OpenAI' : 'Hugging Face'} for embeddings`)
  console.log('')

  let totalProcessed = 0
  let totalStored = 0
  let totalErrors = 0

  // 1. Populate Specs
  console.log('📊 Processing Specs...')
  const specs = await prisma.spec.findMany({
    where: {
      approved: true, // Only approved specs
    },
    include: {
      user: {
        select: { name: true },
      },
    },
  })

  console.log(`   Found ${specs.length} approved specs`)

  for (const spec of specs) {
    try {
      // Create text representation
      const text = [
        `Component: ${spec.componentName}`,
        spec.boltSize ? `Bolt Size: ${spec.boltSize}` : '',
        spec.torqueSpecLow || spec.torqueSpecHigh
          ? `Torque: ${spec.torqueSpecLow || ''}-${spec.torqueSpecHigh || ''} Nm`
          : '',
        spec.sequenceNotes ? `Notes: ${spec.sequenceNotes}` : '',
        spec.applicableModels.length > 0
          ? `Models: ${spec.applicableModels.join(', ')}`
          : '',
        spec.applicableYears.length > 0
          ? `Years: ${spec.applicableYears.join(', ')}`
          : '',
      ]
        .filter(Boolean)
        .join('. ')

      const vectorId = await storeEmbedding(
        text,
        'spec',
        spec.id,
        {
          componentName: spec.componentName,
          boltSize: spec.boltSize,
          torqueSpecLow: spec.torqueSpecLow,
          torqueSpecHigh: spec.torqueSpecHigh,
          applicableModels: spec.applicableModels,
          applicableYears: spec.applicableYears,
          submittedBy: spec.submittedBy,
        }
      )

      if (vectorId) {
        totalStored++
        console.log(`   ✓ Stored: ${spec.componentName}`)
      } else {
        totalErrors++
        console.log(`   ✗ Failed: ${spec.componentName}`)
      }
      totalProcessed++
    } catch (error: any) {
      totalErrors++
      console.error(`   ✗ Error processing spec ${spec.id}:`, error.message)
    }
  }

  // 2. Populate Query History (AI answers)
  console.log('\n💬 Processing Query History...')
  const queryHistory = await prisma.queryHistory.findMany({
    where: {
      success: true,
      response: { not: null },
    },
    take: 100, // Limit to recent 100 queries
    orderBy: {
      createdAt: 'desc',
    },
  })

  console.log(`   Found ${queryHistory.length} query history entries`)

  for (const entry of queryHistory) {
    try {
      if (!entry.response) continue

      const text = `Query: ${entry.query}\nAnswer: ${entry.response}`

      const vectorId = await storeEmbedding(
        text,
        'query',
        entry.id,
        {
          query: entry.query,
          userId: entry.userId,
          createdAt: entry.createdAt.toISOString(),
        }
      )

      if (vectorId) {
        totalStored++
        console.log(`   ✓ Stored query: ${entry.query.substring(0, 50)}...`)
      } else {
        totalErrors++
      }
      totalProcessed++
    } catch (error: any) {
      totalErrors++
      console.error(`   ✗ Error processing query ${entry.id}:`, error.message)
    }
  }

  // 3. Populate Forum Posts
  console.log('\n📝 Processing Forum Posts...')
  const forumPosts = await prisma.forumPost.findMany({
    where: {
      // Only approved/published posts
    },
    take: 100, // Limit to recent 100 posts
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  })

  console.log(`   Found ${forumPosts.length} forum posts`)

  for (const post of forumPosts) {
    try {
      const text = `Title: ${post.title}\nContent: ${post.content}`

      const vectorId = await storeEmbedding(
        text,
        'forum',
        post.id,
        {
          title: post.title,
          authorId: post.authorId,
          tags: post.tags,
          createdAt: post.createdAt.toISOString(),
        }
      )

      if (vectorId) {
        totalStored++
        console.log(`   ✓ Stored post: ${post.title.substring(0, 50)}...`)
      } else {
        totalErrors++
      }
      totalProcessed++
    } catch (error: any) {
      totalErrors++
      console.error(`   ✗ Error processing post ${post.id}:`, error.message)
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Population Summary:')
  console.log(`   Total Processed: ${totalProcessed}`)
  console.log(`   Successfully Stored: ${totalStored}`)
  console.log(`   Errors: ${totalErrors}`)
  console.log('='.repeat(50))

  if (totalStored > 0) {
    console.log('\n✅ Pinecone population complete!')
    console.log(`   ${totalStored} vectors stored in Pinecone`)
    console.log('   Your RAG system is now enhanced! 🚀')
  } else {
    console.log('\n⚠️  No vectors were stored. Check your configuration.')
  }

  await prisma.$disconnect()
}

// Run the script
populatePinecone()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })

