'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, Filter, Loader2 } from 'lucide-react'
import { useDebounce } from 'use-debounce'

export default function SearchBar() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  
  const [query, setQuery] = useState(initialQuery)
  const [debouncedQuery] = useDebounce(query, 300)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Reset loading state when search params change (search completed)
  useEffect(() => {
    setIsLoading(false)
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Only set loading state if not on home page
      if (!isHomePage) {
        setIsLoading(true)
      }
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 25,380+ icons... (e.g., home, arrow, user)"
            className="w-full pl-12 pr-16 py-4 text-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors shadow-lg placeholder-gray-500 dark:placeholder-gray-400"
          />
          {isLoading ? (
            <div className="absolute right-3 p-2 text-blue-600 dark:text-blue-400">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : (
            <button
              type="button"
              className="absolute right-3 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
      
      {/* Quick suggestions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Popular:</span>
        {['home', 'arrow', 'user', 'settings', 'programming language', 'star'].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setQuery(suggestion)}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
