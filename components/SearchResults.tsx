import IconGrid from '@/components/IconGrid'
import SearchBar from '@/components/SearchBar'
import { getIconService } from '@/lib/serviceConfig'

interface SearchResultsProps {
  searchParams: {
    q?: string
    category?: string
    subcategory?: string
    tag?: string
  }
}

export default async function SearchResults({ searchParams }: SearchResultsProps) {
  const { q, category, subcategory, tag } = searchParams
  
  const iconService = getIconService()
  // Using the new fast loading API for better performance
  const results = await iconService.fastSearchIcons(q || '', {
    category,
    subcategory,
    tag
  })

  const title = q 
    ? `Search results for "${q}"`
    : category
    ? `${category} Icons`
    : 'All Icons'

  return (
    <div className="space-y-8">
      {/* Only show SearchBar on search page, not on category or subcategory pages */}
      {!category && (
        <div className="max-w-4xl mx-auto">
          <SearchBar />
        </div>
      )}
      
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Found {results.totalCount.toLocaleString()} icons
            {results.categories.length > 1 && ` across ${results.categories.length} categories`}
          </p>
        </div>
        
        {results.totalCount > 0 ? (
          <IconGrid icons={results.icons} />
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No icons found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try different keywords or browse our categories
            </p>
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Browse Categories
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
