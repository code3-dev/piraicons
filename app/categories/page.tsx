import { Suspense } from 'react'
import Header from '@/components/Header'
import CategoryBrowser from '@/components/CategoryBrowser'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import { getIconService } from '@/lib/serviceConfig'

export const metadata = {
  title: 'Categories - PiraIcons | Browse All Icon Categories',
  description: 'Browse all icon categories in PiraIcons. Explore 25,380+ icons organized by style and category for easy discovery.',
}

export default async function CategoriesPage() {
  const iconService = getIconService()
  const categories = await iconService.getCategoryStructure()
  const totalIcons = categories.reduce((sum, cat) => sum + cat.iconCount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNav 
          items={[
            { name: 'Home', href: '/' },
            { name: 'Categories', href: '/categories' }
          ]} 
        />

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Icon Categories
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Explore our complete collection of {totalIcons.toLocaleString()} icons organized into 
            {categories.length} main categories. Each category features multiple styles and smart tagging.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-soft">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {totalIcons.toLocaleString()}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Total Icons</div>
          </div>
          
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-soft">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {categories.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Categories</div>
          </div>
          
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-soft">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {categories.reduce((sum, cat) => sum + cat.subcategories.length, 0)}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Styles</div>
          </div>
          
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-soft">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {categories.reduce((sum, cat) => 
                sum + cat.subcategories.reduce((subSum, sub) => subSum + sub.tags.length, 0), 0
              )}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Tags</div>
          </div>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }>
          <CategoryBrowser categories={categories} />
        </Suspense>
      </main>
    </div>
  )
}
