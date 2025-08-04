'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2 } from 'lucide-react'

interface CategorySearchBarProps {
  category?: string
  subcategory?: string
}

export default function CategorySearchBar({ category, subcategory }: CategorySearchBarProps) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setIsLoading(true)
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="mb-8">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${subcategory ? subcategory : category ? category : ''} icons...`}
            className="w-full pl-12 pr-16 py-3 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors shadow-md placeholder-gray-500 dark:placeholder-gray-400"
          />
          {isLoading ? (
            <div className="absolute right-3 p-2 text-blue-600 dark:text-blue-400">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : (
            <button
              type="submit"
              className="absolute right-3 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
            >
              Search
            </button>
          )}
        </div>
      </form>
    </div>
  )
}