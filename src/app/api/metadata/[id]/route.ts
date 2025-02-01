import { NextRequest, NextResponse } from 'next/server'

function transformIpfsUrl(url: string, id: string): string {
  if (url.startsWith('ipfs://')) {
    const baseHash = 'bafybeidciudrflherjjbmwth3l35vnmrwtdfspux5zsoxgidhpnjz5xyya'
    return `https://${baseHash}.ipfs.dweb.link/${id}.png`
  }
  return url
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const response = await fetch(
      `https://cache.krc721.stream/krc721/mainnet/metadata/NACHO/${id}`,
      { 
        cache: 'no-store',
        headers: {
          'Accept': 'application/json'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.image) {
      data.image = transformIpfsUrl(data.image, id)
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Metadata fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metadata' }, 
      { status: 500 }
    )
  }
} 