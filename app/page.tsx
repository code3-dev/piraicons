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
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400 mb-6">
            <p>&copy; 2025 PiraIcons. Open source icon library for modern projects.</p>
          </div>
          
          {/* License Card */}
          <div className="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">📜 License Information</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              <strong>PiraIcons</strong> by <strong>Hossein Pira</strong> is licensed under the{' '}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Creative Commons Attribution 4.0 International (CC BY 4.0)
              </a>
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-600">
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                Icons by{' '}
                <a
                  href="https://github.com/code3-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Hossein Pira
                </a>
                {' – '}
                <a
                  href="https://github.com/code3-dev/piraicons-assets"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  PiraIcons
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
