import IconGrid from '@/components/IconGrid'
import SearchBar from '@/components/SearchBar'
import { getIconService } from '@/lib/serviceConfig'

interface SearchResultsProps {
  searchParams: {
    q?: string
    category?: string
    subcategory?: string
    tag?: string
    page?: string
  }
}

export default async function SearchResults({ searchParams }: SearchResultsProps) {
  const { q, category, subcategory, tag, page } = searchParams
  
  // Parse page parameter or default to 1
  const currentPage = page ? parseInt(page) : 1
  const limit = 50 // 50 icons per page
  
  const iconService = getIconService()
  // Using the new fast loading API for better performance with pagination
  const results = await iconService.fastSearchIcons(q || '', {
    category,
    subcategory,
    tag,
    page: currentPage,
    limit
  })

  const title = q 
    ? `Search results for "${q}"`
    : category && subcategory
    ? `${category} ${subcategory} Icons`
    : category
    ? `${category} Icons`
    : tag
    ? `${tag} Icons`
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
          <>
            <IconGrid icons={results.icons} />
            
            {/* Pagination Controls */}
            {results.pagination && results.pagination.totalPages > 1 && (() => {
              // Destructure pagination properties with defaults to avoid TypeScript errors
              const { page = currentPage, totalPages = 1 } = results.pagination;
              
              return (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center space-x-2" aria-label="Pagination">
                    {/* Previous Page Button */}
                    <a
                      href={`?${new URLSearchParams({
                        ...(q ? { q } : {}),
                        ...(category ? { category } : {}),
                        ...(subcategory ? { subcategory } : {}),
                        ...(tag ? { tag } : {}),
                        page: Math.max(1, page - 1).toString()
                      }).toString()}`}
                      className={`px-3 py-2 rounded-md ${page <= 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      aria-disabled={page <= 1}
                    >
                      Previous
                    </a>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show pages around current page
                        let pageNum;
                        if (totalPages <= 5) {
                          // If 5 or fewer pages, show all
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          // If near start, show first 5 pages
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          // If near end, show last 5 pages
                          pageNum = totalPages - 4 + i;
                        } else {
                          // Otherwise show 2 before and 2 after current page
                          pageNum = page - 2 + i;
                        }
                        
                        return (
                          <a
                            key={pageNum}
                            href={`?${new URLSearchParams({
                              ...(q ? { q } : {}),
                              ...(category ? { category } : {}),
                              ...(subcategory ? { subcategory } : {}),
                              ...(tag ? { tag } : {}),
                              page: pageNum.toString()
                            }).toString()}`}
                            className={`px-4 py-2 rounded-md ${pageNum === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            aria-current={pageNum === page ? 'page' : undefined}
                          >
                            {pageNum}
                          </a>
                        );
                      })}
                      
                      {/* Show ellipsis if there are more pages */}
                      {totalPages > 5 && page < totalPages - 2 && (
                        <span className="px-2 py-2 text-gray-500">...</span>
                      )}
                      
                      {/* Always show last page if not in view */}
                      {totalPages > 5 && 
                       page < totalPages - 2 && (
                        <a
                          href={`?${new URLSearchParams({
                            ...(q ? { q } : {}),
                            ...(category ? { category } : {}),
                            ...(subcategory ? { subcategory } : {}),
                            ...(tag ? { tag } : {}),
                            page: totalPages.toString()
                          }).toString()}`}
                          className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {totalPages}
                        </a>
                      )}
                    </div>
                    
                    {/* Next Page Button */}
                    <a
                      href={`?${new URLSearchParams({
                        ...(q ? { q } : {}),
                        ...(category ? { category } : {}),
                        ...(subcategory ? { subcategory } : {}),
                        ...(tag ? { tag } : {}),
                        page: Math.min(totalPages, page + 1).toString()
                      }).toString()}`}
                      className={`px-3 py-2 rounded-md ${page >= totalPages 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      aria-disabled={page >= totalPages}
                    >
                      Next
                    </a>
                  </nav>
                </div>
              );
            })()}
          </>
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
