import { NextRequest, NextResponse } from 'next/server'

const IPFS_GATEWAY = 'https://ipfs.io/ipfs/'
const BASE_HASH = 'bafybeidciudrflherjjbmwth3l35vnmrwtdfspux5zsoxgidhpnjz5xyya'

function transformIpfsUrl(url: string, id: string): string {
  if (url.startsWith('ipfs://')) {
    return `https://${BASE_HASH}.ipfs.dweb.link/${id}.png`
  }
  return url
}

export const runtime = 'edge' // Optional: Better performance

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

    const metadataUrl = `https://cache.krc721.stream/krc721/mainnet/metadata/NACHO/${id}`
    
    const response = await fetch(metadataUrl, { 
      cache: 'no-store',
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // Transform IPFS URLs if present
    if (data.image) {
      data.image = transformIpfsUrl(data.image, id)
    }
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('Metadata fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metadata' }, 
      { status: 500 }
    )
  }
} 