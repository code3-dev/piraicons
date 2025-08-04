import SearchBar from '@/components/SearchBar'
import CategoryGrid from '@/components/CategoryGrid'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import { getIconService } from '@/lib/serviceConfig'

export default async function Home() {
  const iconService = getIconService()
  const categories = await iconService.getCategoryStructure()
  const totalIcons = categories.reduce((sum, cat) => sum + cat.iconCount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <Hero totalIcons={totalIcons} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mb-12">
          <SearchBar />
        </div>
        
        <CategoryGrid categories={categories} />
      </main>
      
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 PiraIcons. Open source icon library for modern projects.</p>
        </div>
      </footer>
    </div>
  )
}
