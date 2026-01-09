import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// Garage feature temporarily disabled until migrations are run
// All endpoints return 503 Service Unavailable

export async function GET(request: NextRequest) {
  return NextResponse.json({ error: 'Garage feature is temporarily disabled' }, { status: 503 })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'Garage feature is temporarily disabled' }, { status: 503 })
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({ error: 'Garage feature is temporarily disabled' }, { status: 503 })
}

export async function PATCH(request: NextRequest) {
  return NextResponse.json({ error: 'Garage feature is temporarily disabled' }, { status: 503 })
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ error: 'Garage feature is temporarily disabled' }, { status: 503 })
}
