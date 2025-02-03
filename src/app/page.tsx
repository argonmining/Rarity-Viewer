'use client'

import { useState } from 'react'
import SearchBar from '@/components/SearchBar'
import NftDisplay from '@/components/NftDisplay'
import NftList from '@/components/NftList'
import { toast } from 'react-hot-toast'

export default function Home() {
  const [searchedId, setSearchedId] = useState<string>('')

  const handleSearch = (id: string) => {
    const num = parseInt(id)
    if (isNaN(num) || num < 1 || num > 10000) {
      toast.error('Please enter a valid number between 1 and 10000')
      return
    }
    setSearchedId(id)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-4">
            Nacho Kats Rarity Checker
          </h1>
          <p className="text-gray-400 text-lg">
            Enter a Nacho Kat ID (1-10000) to view its traits and rarity
          </p>
        </div>
        
        <SearchBar onSearch={handleSearch} />
        
        {searchedId && <NftDisplay id={searchedId} />}
        
        <NftList onSelectNft={handleSearch} />
      </div>
    </main>
  )
} 