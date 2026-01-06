#!/usr/bin/env ts-node
/**
 * PDF Parsing Script for WrenchMC Goliath
 * 
 * This script downloads and parses free Harley-Davidson service manuals
 * from various sources and extracts technical specifications into the database.
 * 
 * Usage: npm run parse-pdfs
 * 
 * Sources:
 * - CarlSalter.com (free manuals)
 * - Lowbrow Customs (technical guides)
 * - HDForums (community manuals)
 * - And more...
 */

import { PrismaClient } from '@prisma/client'
import pdfParse from 'pdf-parse'
import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'

const prisma = new PrismaClient()

interface ParsedSpec {
  componentName: string
  boltSize?: string
  torqueSpecLow?: number
  torqueSpecHigh?: number
  sequenceNotes?: string
  applicableYears?: number[]
  applicableModels?: string[]
  sourceNotes: string
}

// PDF sources (add more as needed)
const PDF_SOURCES = [
  {
    name: 'CarlSalter.com',
    url: 'https://example.com/manual.pdf', // Replace with actual URLs
    model: 'Touring',
    years: [2010, 2020],
  },
  // Add more sources...
]

async function downloadPDF(url: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(outputPath)

    protocol
      .get(url, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          // Handle redirects
          return downloadPDF(response.headers.location!, outputPath).then(resolve).catch(reject)
        }

        response.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve()
        })
      })
      .on('error', (err) => {
        fs.unlinkSync(outputPath)
        reject(err)
      })
  })
}

async function parsePDF(filePath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(filePath)
  const data = await pdfParse(dataBuffer)
  return data.text
}

function extractSpecs(text: string, source: string): ParsedSpec[] {
  const specs: ParsedSpec[] = []
  
  // Regex patterns for common spec formats
  const torquePattern = /(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)\s*(?:Nm|ft-lbs?|lb-ft)/gi
  const componentPattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*(?:bolt|screw|nut|cover|gasket)/gi
  const boltSizePattern = /(?:bolt|screw|nut)\s*(?:size|diameter)?:?\s*(M\d+|[\d/]+-[\d]+|[\d/]+)/gi

  // Extract torque specs
  let match
  const torqueMatches: Array<{ low: number; high: number; index: number }> = []
  
  while ((match = torquePattern.exec(text)) !== null) {
    const low = parseFloat(match[1])
    const high = parseFloat(match[2])
    torqueMatches.push({ low, high, index: match.index })
  }

  // Extract component names
  const componentMatches: Array<{ name: string; index: number }> = []
  while ((match = componentPattern.exec(text)) !== null) {
    componentMatches.push({ name: match[1], index: match.index })
  }

  // Match components with nearby torque specs
  for (const component of componentMatches) {
    const nearbyTorque = torqueMatches.find(
      (t) => Math.abs(t.index - component.index) < 200
    )

    if (nearbyTorque) {
      specs.push({
        componentName: component.name,
        torqueSpecLow: nearbyTorque.low,
        torqueSpecHigh: nearbyTorque.high,
        sourceNotes: `Parsed from ${source}`,
      })
    }
  }

  return specs
}

async function saveSpecsToDatabase(specs: ParsedSpec[], userId: string) {
  for (const spec of specs) {
    try {
      await prisma.spec.create({
        data: {
          ...spec,
          submittedBy: userId,
          approved: false, // Require moderation
        },
      })
      console.log(`✓ Saved spec: ${spec.componentName}`)
    } catch (error) {
      console.error(`✗ Failed to save spec: ${spec.componentName}`, error)
    }
  }
}

async function main() {
  console.log('🚀 Starting PDF parsing...\n')

  // Create temp directory
  const tempDir = path.join(process.cwd(), 'temp-pdfs')
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  // Get or create system user for automated imports
  let systemUser = await prisma.user.findFirst({
    where: { email: 'system@wrenchmc.com' },
  })

  if (!systemUser) {
    systemUser = await prisma.user.create({
      data: {
        email: 'system@wrenchmc.com',
        name: 'System',
        role: 'admin',
      },
    })
  }

  let totalSpecs = 0

  for (const source of PDF_SOURCES) {
    console.log(`\n📄 Processing: ${source.name}`)
    
    try {
      const fileName = `${source.name.replace(/\s+/g, '-')}.pdf`
      const filePath = path.join(tempDir, fileName)

      // Download PDF (if URL is valid)
      if (source.url.startsWith('http')) {
        console.log(`  Downloading from ${source.url}...`)
        await downloadPDF(source.url, filePath)
      } else {
        console.log(`  ⚠️  Skipping invalid URL: ${source.url}`)
        continue
      }

      // Parse PDF
      console.log('  Parsing PDF...')
      const text = await parsePDF(filePath)

      // Extract specs
      console.log('  Extracting specs...')
      const specs = extractSpecs(text, source.name)

      // Save to database
      console.log(`  Saving ${specs.length} specs to database...`)
      await saveSpecsToDatabase(specs, systemUser.id)
      totalSpecs += specs.length

      // Clean up
      fs.unlinkSync(filePath)
      console.log(`  ✓ Completed: ${source.name}`)
    } catch (error: any) {
      console.error(`  ✗ Error processing ${source.name}:`, error.message)
    }
  }

  // Clean up temp directory
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true })
  }

  console.log(`\n✅ PDF parsing complete! Extracted ${totalSpecs} specs.`)
  await prisma.$disconnect()
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

