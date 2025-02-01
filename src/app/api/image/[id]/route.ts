import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!params?.id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://cache.krc721.stream/krc721/mainnet/image/NACHO/${params.id}`,
      { cache: 'no-store' }
    )
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch image' }, 
        { status: response.status }
      )
    }

    const buffer = await response.arrayBuffer()
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch image' }, 
      { status: 500 }
    )
  }
} 