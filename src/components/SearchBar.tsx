'use client'

import { useState } from 'react'

interface SearchBarProps {
  onSearch: (id: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(input)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-12">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter Nacho Kat ID..."
          className="w-full px-6 py-4 text-lg bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-white placeholder-gray-500"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-md hover:opacity-90 transition-opacity"
        >
          Search
        </button>
      </div>
    </form>
  )
} 