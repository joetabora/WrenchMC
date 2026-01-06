import { NextRequest, NextResponse } from 'next/server'
import pdfParse from 'pdf-parse'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 })
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 })
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text from PDF
    const data = await pdfParse(buffer)
    const text = data.text

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ 
        error: 'No text could be extracted from PDF. The PDF might be image-based or encrypted.' 
      }, { status: 400 })
    }

    return NextResponse.json({
      text: text,
      pageCount: data.numpages,
      info: {
        title: data.info?.Title || null,
        author: data.info?.Author || null,
      }
    })
  } catch (err: any) {
    console.error('PDF processing error:', err)
    return NextResponse.json({ 
      error: `Failed to process PDF: ${err.message || 'Unknown error'}` 
    }, { status: 500 })
  }
}


