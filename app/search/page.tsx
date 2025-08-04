import { Suspense } from 'react'
import SearchResults from '@/components/SearchResults'
import Header from '@/components/Header'

interface SearchPageProps {
  searchParams: {
    q?: string
    category?: string
    subcategory?: string
    tag?: string
    page?: string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }>
          <SearchResults searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  )
}
