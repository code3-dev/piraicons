'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, X, Filter, Search, Loader2 } from 'lucide-react'

interface Category {
  name: string
  iconCount: number
}

interface Subcategory {
  name: string
  iconCount: number
}

interface FilterBarProps {
  currentCategory?: string
  currentSubcategory?: string
  searchQuery?: string
}

export default function FilterBar({ currentCategory, currentSubcategory, searchQuery }: FilterBarProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState(currentCategory || '')
  const [selectedSubcategory, setSelectedSubcategory] = useState(currentSubcategory || '')
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState(searchQuery || '')
  
  const router = useRouter()
  const searchParams = useSearchParams()

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        setCategories(data.categories || [])
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Fetch subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      const fetchSubcategories = async () => {
        try {
          const response = await fetch(`/api/categories?category=${encodeURIComponent(selectedCategory)}`)
          const data = await response.json()
          // Assuming the API returns subcategories for the selected category
          setSubcategories(data.subcategories || [])
        } catch (error) {
          console.error('Failed to fetch subcategories:', error)
          setSubcategories([])
        }
      }
      fetchSubcategories()
    } else {
      setSubcategories([])
      setSelectedSubcategory('')
    }
  }, [selectedCategory])

  const updateFilters = (category?: string, subcategory?: string) => {
    setLoading(true)
    
    const params = new URLSearchParams()
    
    // Keep existing search query
    if (searchQuery) {
      params.set('q', searchQuery)
    }
    
    // Add category filter
    if (category && category !== '') {
      params.set('category', category)
    }
    
    // Add subcategory filter
    if (subcategory && subcategory !== '') {
      params.set('subcategory', subcategory)
    }
    
    // Navigate to search page with filters
    const url = params.toString() ? `/search?${params.toString()}` : '/search'
    router.push(url)
    
    setTimeout(() => setLoading(false), 500)
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setSelectedSubcategory('') // Reset subcategory when category changes
    setShowCategoryDropdown(false)
    updateFilters(category, '')
  }

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory)
    setShowSubcategoryDropdown(false)
    updateFilters(selectedCategory, subcategory)
  }

  const removeFilter = (filterType: 'category' | 'subcategory') => {
    if (filterType === 'category') {
      setSelectedCategory('')
      setSelectedSubcategory('')
      updateFilters('', '')
    } else if (filterType === 'subcategory') {
      setSelectedSubcategory('')
      updateFilters(selectedCategory, '')
    }
  }

  const clearAllFilters = () => {
    setSelectedCategory('')
    setSelectedSubcategory('')
    
    const params = new URLSearchParams()
    if (searchQuery) {
      params.set('q', searchQuery)
    }
    
    const url = params.toString() ? `/search?${params.toString()}` : '/search'
    router.push(url)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setLoading(true)
      
      const params = new URLSearchParams()
      params.set('q', query.trim())
      
      if (selectedCategory) {
        params.set('category', selectedCategory)
      }
      
      if (selectedSubcategory) {
        params.set('subcategory', selectedSubcategory)
      }
      
      router.push(`/search?${params.toString()}`)
      setTimeout(() => setLoading(false), 500)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search icons... (e.g., home, arrow, user)"
            className="w-full pl-12 pr-16 py-3 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors shadow-md placeholder-gray-500 dark:placeholder-gray-400"
          />
          {loading ? (
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
      
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</span>
        {(selectedCategory || selectedSubcategory) && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-auto"
          >
            Clear all
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-3">
        {/* Category Filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowCategoryDropdown(!showCategoryDropdown)
              setShowSubcategoryDropdown(false)
            }}
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 text-sm transition-colors"
          >
            <span className="text-gray-700 dark:text-gray-300">
              {selectedCategory || 'Category'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          
          {selectedCategory && (
            <button
              onClick={() => removeFilter('category')}
              className="absolute -top-1 -right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          
          {showCategoryDropdown && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategorySelect(category.name)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 flex justify-between items-center"
                >
                  <span>{category.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {category.iconCount}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Subcategory Filter */}
        <div className="relative">
          <button
            onClick={() => {
              if (selectedCategory) {
                setShowSubcategoryDropdown(!showSubcategoryDropdown)
                setShowCategoryDropdown(false)
              }
            }}
            disabled={!selectedCategory}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
              selectedCategory
                ? 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>
              {selectedSubcategory || 'Subcategory'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          
          {selectedSubcategory && (
            <button
              onClick={() => removeFilter('subcategory')}
              className="absolute -top-1 -right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          
          {showSubcategoryDropdown && selectedCategory && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {subcategories.length > 0 ? (
                subcategories.map((subcategory) => (
                  <button
                    key={subcategory.name}
                    onClick={() => handleSubcategorySelect(subcategory.name)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 flex justify-between items-center"
                  >
                    <span>{subcategory.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {subcategory.iconCount}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  No subcategories available
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Active Filters Display */}
      {(selectedCategory || selectedSubcategory) && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <span className="text-xs text-gray-600 dark:text-gray-400">Active filters:</span>
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
              Category: {selectedCategory}
              <button
                onClick={() => removeFilter('category')}
                className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedSubcategory && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
              Subcategory: {selectedSubcategory}
              <button
                onClick={() => removeFilter('subcategory')}
                className="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
      
      {loading && (
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Updating filters...
        </div>
      )}
    </div>
  )
}
