'use client'

import { useState, useEffect, useRef } from 'react'
import { RarityData } from '@/types/rarity'
import rarityDataImport from '@/data/rarity_data.json'
import Link from 'next/link'
import LoadingSpinner from './LoadingSpinner'

const rarityData = rarityDataImport as RarityData

interface NftListProps {
  onSelectNft: (id: string) => void
}

type FilterType = 'rarity' | 'traits'
type RarityTier = 'One of One' | 'One of Two' | 'Legendary' | 'Epic' | 'Rare' | 'Uncommon' | 'Common'

interface TraitFilters {
  [key: string]: string[]
}

interface DropdownState {
  [key: string]: boolean
}

export default function NftList({ onSelectNft }: NftListProps) {
  const [filterType, setFilterType] = useState<FilterType>('rarity')
  const [selectedRarity, setSelectedRarity] = useState<RarityTier | ''>('')
  const [traitFilters, setTraitFilters] = useState<TraitFilters>({})
  const [filteredNfts, setFilteredNfts] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const itemsPerPage = 50
  const [dropdownOpen, setDropdownOpen] = useState<DropdownState>({})
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Get all trait categories
  const traitCategories = Object.keys(rarityData.trait_rarity)
  const getTraitValues = (traitType: string) => Object.keys(rarityData.trait_rarity[traitType])

  // Handle trait filter change
  const handleTraitFilterChange = (category: string, values: string[]) => {
    setTraitFilters(prev => ({
      ...prev,
      [category]: values
    }))
    setPage(1)
  }

  // Get NFTs by rarity tier
  const getNftsByRarity = (tier: RarityTier) => {
    return Object.entries(rarityData.nft_rarity)
      .filter(([_, data]) => {
        if (tier === 'One of One') {
          return data.is_special === 'one_of_one'
        }
        if (tier === 'One of Two') {
          return data.is_special === 'one_of_two'
        }
        return data.rarity_tier === tier
      })
      .map(([id]) => id)
      .sort((a, b) => Number(a) - Number(b))
  }

  // Filter NFTs by traits
  const getNftsByTraits = (filters: TraitFilters) => {
    const activeFilters = Object.entries(filters).filter(([_, values]) => values.length > 0)
    if (activeFilters.length === 0) return []

    return Object.entries(rarityData.nft_rarity)
      .filter(([_, data]) => {
        if (!data.trait_breakdown) return false
        
        return activeFilters.every(([category, selectedValues]) => {
          const trait = data.trait_breakdown?.find(t => t.trait_type === category)
          return selectedValues.length === 0 || (trait && selectedValues.includes(trait.value))
        })
      })
      .map(([id]) => id)
      .sort((a, b) => Number(a) - Number(b))
  }

  useEffect(() => {
    setLoading(true)
    try {
      if (filterType === 'rarity' && selectedRarity) {
        const nfts = getNftsByRarity(selectedRarity as RarityTier)
        setFilteredNfts(nfts)
      } else if (filterType === 'traits') {
        const nfts = getNftsByTraits(traitFilters)
        setFilteredNfts(nfts)
      }
    } catch (error) {
      console.error('Error filtering NFTs:', error)
    } finally {
      setLoading(false)
    }
  }, [filterType, selectedRarity, traitFilters])

  const paginatedNfts = filteredNfts.slice((page - 1) * itemsPerPage, page * itemsPerPage)
  const totalPages = Math.ceil(filteredNfts.length / itemsPerPage)

  // Add this new handler
  const toggleDropdown = (category: string) => {
    setDropdownOpen(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.entries(dropdownRefs.current).forEach(([category, ref]) => {
        if (ref && !ref.contains(event.target as Node)) {
          setDropdownOpen(prev => ({
            ...prev,
            [category]: false
          }))
        }
      })
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Replace the existing trait filters JSX with this new implementation
  const renderTraitFilters = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {traitCategories.map(category => (
        <div 
          key={category} 
          className="w-full"
          ref={el => dropdownRefs.current[category] = el}
        >
          <label className="block text-sm font-medium text-gray-400 mb-2">
            {category}
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown(category)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors text-left flex justify-between items-center"
            >
              <span className="truncate">
                {traitFilters[category]?.length 
                  ? `${traitFilters[category].length} selected`
                  : 'Select options'}
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                className={`w-5 h-5 transition-transform ${dropdownOpen[category] ? 'rotate-180' : ''}`}
              >
                <path 
                  fillRule="evenodd" 
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" 
                  clipRule="evenodd" 
                />
              </svg>
            </button>

            {dropdownOpen[category] && (
              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {getTraitValues(category).map(value => (
                    <label
                      key={value}
                      className="flex items-center px-2 py-1.5 hover:bg-gray-700/50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={traitFilters[category]?.includes(value) || false}
                        onChange={(e) => {
                          const currentValues = traitFilters[category] || []
                          const newValues = e.target.checked
                            ? [...currentValues, value]
                            : currentValues.filter(v => v !== value)
                          handleTraitFilterChange(category, newValues)
                        }}
                        className="w-4 h-4 rounded border-gray-600 text-teal-500 focus:ring-teal-500 focus:ring-offset-0 bg-gray-700"
                      />
                      <span className="ml-2 text-sm text-white">{value}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className="mt-1.5 text-xs text-gray-500">
            {traitFilters[category]?.length || 0} selected
          </p>
        </div>
      ))}
    </div>
  )

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 mb-6">
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value as FilterType)
            setSelectedRarity('')
            setTraitFilters({})
            setPage(1)
          }}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
        >
          <option value="rarity">Filter by Rarity</option>
          <option value="traits">Filter by Traits</option>
        </select>

        {filterType === 'traits' && renderTraitFilters()}

        {filterType === 'rarity' && (
          <select
            value={selectedRarity}
            onChange={(e) => {
              setSelectedRarity(e.target.value as RarityTier)
              setPage(1)
            }}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
          >
            <option value="">Select Rarity Tier</option>
            <option value="One of One">One of One</option>
            <option value="One of Two">One of Two</option>
            <option value="Legendary">Legendary</option>
            <option value="Epic">Epic</option>
            <option value="Rare">Rare</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Common">Common</option>
          </select>
        )}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {paginatedNfts.map((id) => (
              <button
                key={id}
                onClick={() => onSelectNft(id)}
                className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors"
              >
                #{id}
              </button>
            ))}
          </div>

          {filteredNfts.length > 0 && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
} 