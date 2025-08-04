import { notFound } from 'next/navigation'
import { getIconService } from '@/lib/serviceConfig'
import Header from '@/components/Header'
import SearchResults from '@/components/SearchResults'
import CategorySearchBar from '@/components/CategorySearchBar'
import BreadcrumbNav from '@/components/BreadcrumbNav'

interface SubcategoryPageProps {
  params: {
    category: string
    subcategory: string
  }
  searchParams: {
    q?: string
    page?: string
  }
}

export default async function SubcategoryPage({ params, searchParams }: SubcategoryPageProps) {
  const { category, subcategory } = params
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1)
  const subcategoryName = subcategory.charAt(0).toUpperCase() + subcategory.slice(1)
  
  // Validate category and subcategory
  const iconService = getIconService()
  const categories = await iconService.getLightCategories()
  const validCategory = categories.find(cat => cat.name.toLowerCase() === category.toLowerCase())
  
  if (!validCategory) {
    notFound()
  }
  
  const subcategories = await iconService.getLightSubcategories(categoryName)
  const validSubcategory = subcategories.find(
    sub => sub.name.toLowerCase() === subcategory.toLowerCase()
  )
  
  if (!validSubcategory) {
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
            { name: categoryName, href: `/${category}` },
            { name: subcategoryName, href: `/${category}/${subcategory}` }
          ]} 
          className="mb-6"
        />
        
        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <CategorySearchBar category={categoryName} subcategory={subcategoryName} />
        </div>
        
        <SearchResults 
          searchParams={{
            ...searchParams,
            category: categoryName,
            subcategory: subcategoryName
          }} 
        />
      </main>
    </div>
  )
}

export async function generateStaticParams() {
  // Get categories and subcategories from MongoDB
  const iconService = getIconService()
  const categories = await iconService.getLightCategories()
  const params: { category: string; subcategory: string }[] = []
  
  for (const category of categories) {
    const subcategories = await iconService.getLightSubcategories(category.name)
    subcategories.forEach(subcategory => {
      params.push({
        category: category.name.toLowerCase(),
        subcategory: subcategory.name.toLowerCase()
      })
    })
  }
  
  return params
}
