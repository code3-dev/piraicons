'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Package } from 'lucide-react'
import { IconCategory } from '@/types/icons'

interface CategoryGridProps {
  categories: IconCategory[]
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Icon Categories
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Browse icons by category and style. Each category is automatically organized with smart tagging.
        </p>
      </div>

      <div className="grid gap-8">
        {categories.map((category, categoryIndex) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {category.iconCount.toLocaleString()} icons • {category.subcategories.length} styles
                  </p>
                </div>
              </div>
              
              <Link
                href={category.path}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.subcategories.map((subcategory, subIndex) => (
                <motion.div
                  key={subcategory.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: (categoryIndex * 0.1) + (subIndex * 0.05) }}
                >
                  <Link
                    href={subcategory.path}
                    className="block p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {subcategory.name}
                      </h4>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors transform group-hover:translate-x-1" />
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {subcategory.iconCount.toLocaleString()} icons • {subcategory.tags.length} categories
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {subcategory.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag.name}
                          className="text-xs px-2 py-1 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
                        >
                          {tag.name}
                        </span>
                      ))}
                      {subcategory.tags.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                          +{subcategory.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
