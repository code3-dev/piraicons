import { notFound } from 'next/navigation'
import { getIconService } from '@/lib/serviceConfig'
import Header from '@/components/Header'
import SearchResults from '@/components/SearchResults'
import CategorySearchBar from '@/components/CategorySearchBar'
import BreadcrumbNav from '@/components/BreadcrumbNav'

interface CategoryPageProps {
  params: {
    category: string
  }
  searchParams: {
    q?: string
    page?: string
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = params
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1)
  
  // Validate category
  const iconService = getIconService()
  const categories = await iconService.getLightCategories()
  const validCategory = categories.find(cat => cat.name.toLowerCase() === category.toLowerCase())
  
  if (!validCategory) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNav 
          items={[
            { name: 'Home', href: '/' },
            { name: 'Categories', href: '/categories' },
            { name: categoryName, href: `/${category}` }
          ]} 
          className="mb-6"
        />
        
        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <CategorySearchBar category={categoryName} />
        </div>
        
        <SearchResults 
          searchParams={{
            ...searchParams,
            category: categoryName
          }} 
        />
      </main>
    </div>
  )
}

export async function generateStaticParams() {
  // Get categories from MongoDB
  const iconService = getIconService()
  const categories = await iconService.getLightCategories()
  
  return categories.map((category) => ({
    category: category.name.toLowerCase(),
  }))
}
