'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import type { RarityData } from '@/types/rarity'
import TraitCard from './TraitCard'
import LoadingSpinner from './LoadingSpinner'

// Import rarity data
import rarityDataImport from '@/data/rarity_data.json'
const rarityData = rarityDataImport as RarityData

interface NftDisplayProps {
  id: string
}

interface Metadata {
  name: string
  attributes: {
    trait_type: string
    value: string
  }[]
  image: string
}

interface MintStatus {
  isMinted: boolean
  owner?: string
}

function transformImageUrl(url: string, id: string): string {
  if (!url) return ''
  if (url.startsWith('ipfs://')) {
    const baseHash = 'bafybeidciudrflherjjbmwth3l35vnmrwtdfspux5zsoxgidhpnjz5xyya'
    return `https://${baseHash}.ipfs.dweb.link/${id}.png`
  }
  return url
}

export default function NftDisplay({ id }: NftDisplayProps) {
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const [mintStatus, setMintStatus] = useState<MintStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch metadata
        const metadataResponse = await fetch(`/api/metadata/${id}`)
        if (!metadataResponse.ok) {
          throw new Error(`HTTP error! status: ${metadataResponse.status}`)
        }
        
        const metadataData = await metadataResponse.json()
        if (metadataData.error) {
          throw new Error(metadataData.error)
        }
        
        if (metadataData.image) {
          metadataData.image = transformImageUrl(metadataData.image, id)
        }
        
        setMetadata(metadataData)

        // Fetch mint status
        const mintResponse = await fetch(`https://mainnet.krc721.stream/api/v1/krc721/mainnet/history/NACHO/${id}`)
        if (mintResponse.ok) {
          const mintData = await mintResponse.json()
          setMintStatus({
            isMinted: mintData.result.length > 0,
            owner: mintData.result[0]?.owner
          })
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch metadata'
        setError(message)
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-red-500">Error: {error}</div>
  if (!metadata) return <div>No information found for NFT #{id}</div>

  const rarityInfo = rarityData.nft_rarity[id]
  const rarityTier = rarityInfo?.rarity_tier || 'Unknown'

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700 relative">
      {/* Remove the absolute positioning and add responsive classes */}
      {mintStatus && (
        <div className="hidden md:block absolute top-4 right-4">
          {mintStatus.isMinted ? (
            <a
              href={`https://nft.katscan.xyz/nft/address/${mintStatus.owner}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors cursor-pointer text-sm font-medium"
            >
              Minted
            </a>
          ) : (
            <a
              href="https://t.me/kspr_home_bot?start=nacho"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors cursor-pointer text-sm font-medium"
            >
              Not Minted
            </a>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="relative bg-gray-900/90 rounded-xl overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-10" />
          </div>
          {metadata?.image && (
            <div className="relative">
              <Image
                src={metadata.image}
                alt={metadata?.name || `Nacho Kat #${id}`}
                width={1000}
                height={1000}
                className="w-full h-auto"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {metadata?.name}
              </h2>
              <div className="flex flex-wrap gap-2 items-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-900/80"
                  style={{
                    border: `1px solid ${getRarityColor(rarityTier)}50`
                  }}>
                  <span className="text-sm font-semibold" style={{ color: getRarityColor(rarityTier) }}>
                    {rarityTier}
                  </span>
                </div>
                
                {/* Mobile mint status */}
                {mintStatus && (
                  <div className="md:hidden">
                    {mintStatus.isMinted ? (
                      <a
                        href={`https://nft.katscan.xyz/nft/address/${mintStatus.owner}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors cursor-pointer text-sm font-medium"
                      >
                        Minted
                      </a>
                    ) : (
                      <a
                        href="https://t.me/kspr_home_bot?start=nacho"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors cursor-pointer text-sm font-medium"
                      >
                        Not Minted
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Rarity Score</p>
              <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                {rarityInfo?.rarity_score.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Rank</p>
              <p className="text-xl font-bold text-white">
                #{rarityInfo?.rank.toLocaleString()} 
                <span className="text-xs text-gray-400"> / 10000</span>
              </p>
            </div>
          </div>

          {/* Traits Grid */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Traits</h3>
            <div className="grid grid-cols-2 gap-2">
              {metadata?.attributes.map((trait) => (
                <TraitCard
                  key={trait.trait_type}
                  trait={trait}
                  rarity={getRarityForTrait(trait.trait_type, trait.value)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getRarityColor(tier?: string): string {
  switch (tier) {
    case 'Legendary': return '#FFD700'
    case 'Epic': return '#9370DB'
    case 'Rare': return '#4169E1'
    case 'Uncommon': return '#32CD32'
    case 'Common': return '#808080'
    default: return '#FFFFFF'
  }
}

function getRarityForTrait(traitType: string, value: string) {
  const traitData = rarityData.trait_rarity[traitType]?.[value]
  return {
    percentage: traitData?.percentage || 0,
    rarity_tier: traitData?.rarity_tier || 'Unknown'
  }
} 