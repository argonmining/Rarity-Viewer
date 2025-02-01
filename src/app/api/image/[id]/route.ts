import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge' // Optional: Better performance for image handling

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params

    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' }, 
        { status: 400 }
      )
    }

    const imageUrl = `https://cache.krc721.stream/krc721/mainnet/image/NACHO/${id}`
    
    const response = await fetch(imageUrl, { 
      cache: 'no-store',
      headers: {
        'Accept': 'image/png'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const buffer = await response.arrayBuffer()
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('Image fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch image' }, 
      { status: 500 }
    )
  }
} 