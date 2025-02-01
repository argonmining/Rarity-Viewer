import { NextResponse } from 'next/server'

function transformIpfsUrl(url: string, id: string): string {
  if (url.startsWith('ipfs://')) {
    const baseHash = 'bafybeidciudrflherjjbmwth3l35vnmrwtdfspux5zsoxgidhpnjz5xyya'
    return `https://${baseHash}.ipfs.dweb.link/${id}.png`
  }
  return url
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!params?.id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://cache.krc721.stream/krc721/mainnet/metadata/NACHO/${params.id}`,
      { cache: 'no-store' }
    )
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch metadata' }, 
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Transform IPFS URLs in the metadata using the ID
    if (data.image) {
      data.image = transformIpfsUrl(data.image, params.id)
    }
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch metadata' }, 
      { status: 500 }
    )
  }
} 