'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Package, Grid, List } from 'lucide-react'
import { IconCategory } from '@/types/icons'

interface CategoryBrowserProps {
  categories: IconCategory[]
}

export default function CategoryBrowser({ categories }: CategoryBrowserProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <div className="space-y-6">
      {/* View Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Browse Categories
        </h2>
        
        <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              viewMode === 'grid' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Grid className="w-4 h-4 mr-2 inline" />
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              viewMode === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <List className="w-4 h-4 mr-2 inline" />
            List
          </button>
        </div>
      </div>


      {/* Categories */}
      <div className={viewMode === 'grid' 
        ? 'grid gap-6 md:grid-cols-2' 
        : 'space-y-4'
      }>
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-strong transition-all duration-200 ${
              viewMode === 'list' ? 'flex items-center' : ''
            }`}
          >
            {viewMode === 'grid' ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {category.iconCount.toLocaleString()} icons • {category.subcategories.length} styles
                      </p>
                    </div>
                  </div>
                  
                  <Link
                    href={category.path}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>

                {/* Show all subcategories */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Styles:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.name}
                        href={subcategory.path}
                        className="p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors group"
                      >
                        <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {subcategory.name}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {subcategory.iconCount} icons
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Show all tags */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(category.subcategories.flatMap(subcategory => 
                      subcategory.tags.map(tag => tag.name)
                    ))].map(tagName => (
                      <Link
                        key={tagName}
                        href={`/search?q=${encodeURIComponent(tagName)}`}
                        className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
                      >
                        {tagName}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col p-6 w-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {category.iconCount.toLocaleString()} icons • {category.subcategories.length} styles
                      </p>
                    </div>
                  </div>
                  
                  <Link
                    href={category.path}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                
                {/* Show all subcategories */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Styles:</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.path}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Show all tags */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(category.subcategories.flatMap(subcategory => 
                      subcategory.tags.map(tag => tag.name)
                    ))].map(tagName => (
                      <Link
                        key={tagName}
                        href={`/search?q=${encodeURIComponent(tagName)}`}
                        className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
                      >
                        {tagName}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

    </div>
  )
}
