'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Copy, Download } from 'lucide-react'
import { IconFile } from '@/types/icons'
import toast from 'react-hot-toast'
import IconPreview from './IconPreview'
import Image from 'next/image'
import { getIconService } from '@/lib/serviceConfig'

interface IconGridProps {
  icons: IconFile[]
}

export default function IconGrid({ icons }: IconGridProps) {
  const [selectedIcon, setSelectedIcon] = useState<IconFile | null>(null)
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)
  const [loadedIcons, setLoadedIcons] = useState<boolean>(false)
  const [visibleIcons, setVisibleIcons] = useState<IconFile[]>([])
  
  // Load icons after component mounts (client-side)
  useEffect(() => {
    if (icons.length > 0) {
      // Initialize with all icons to ensure they're all available
      setVisibleIcons(icons);
      
      // Small delay to ensure DOM is ready before loading images
      const timer = setTimeout(() => {
        setLoadedIcons(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [icons])
  
  // Helper function to get the correct URL for an icon
  const getIconUrl = (icon: IconFile): string => {
    // If it's already a full URL, return it as is
    if (icon.path.startsWith('http')) {
      return icon.path;
    }
    
    // Otherwise, construct the database API URL
    const pathParts = icon.path.split('/');
    const filename = pathParts.pop() || '';
    const tag = pathParts.pop() || '';
    const subcategory = pathParts.pop() || '';
    const category = pathParts.pop() || '';
    
    return `/api/db/svg/${category}/${subcategory}/${tag}/${filename}`;
  }

  const copyIconPath = (icon: IconFile) => {
    // Use githubPath if available, otherwise fall back to the local path or API URL
    const iconUrl = icon.githubPath || getIconUrl(icon);
    navigator.clipboard.writeText(iconUrl)
    toast.success('Icon Link copied to clipboard!')
  }

  const downloadIcon = (icon: IconFile) => {
    // Use githubPath if available, otherwise fall back to the local path or API URL
    const downloadUrl = icon.githubPath || getIconUrl(icon);
    
    // Use fetch to get the content as a blob
    fetch(downloadUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = icon.filename || `${icon.name}.svg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        toast.success('Icon downloaded!')
      })
      .catch(error => {
        console.error('Error downloading icon:', error)
        toast.error('Failed to download icon')
      })
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {!loadedIcons && icons.map((_, index) => (
          <div key={`loading-${index}`} className="aspect-square bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-4">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
            <div className="mt-2 text-center">
              <div className="h-3 w-16 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
        
        {loadedIcons && visibleIcons.map((icon, index) => (
          <motion.div
            key={`${icon.path}-${index}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            className="relative group"
            onMouseEnter={() => setHoveredIcon(icon.path)}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            <div className="aspect-square bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 p-4 cursor-pointer group-hover:shadow-lg">
              <div className="w-full h-full flex items-center justify-center">
                <div
                  className="w-8 h-8 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors relative"
                >
                  {loadedIcons ? (
                    <img 
                      src={icon.githubPath || getIconUrl(icon)}
                      alt={icon.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      onError={(e) => {
                        // If image fails to load, show a fallback
                        e.currentTarget.style.display = 'none';
                        // Check if nextElementSibling exists before accessing its properties
                        if (e.currentTarget.nextElementSibling) {
                          // Cast to HTMLElement to access style property
                          (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                        }
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                  )}
                  <div 
                    className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-md hidden"
                    style={{ display: 'none' }}
                  ></div>
                </div>
              </div>
              
              {/* Action buttons */}
              <AnimatePresence>
                {hoveredIcon === icon.path && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 bg-black/80 rounded-xl flex items-center justify-center gap-2"
                  >
                    <button
                      onClick={() => setSelectedIcon(icon)}
                      className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyIconPath(icon)}
                      className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                      title="Copy Link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadIcon(icon)}
                      className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate" title={icon.name}>
                {icon.name}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Icon Preview Modal */}
      <IconPreview
        icon={selectedIcon}
        isOpen={!!selectedIcon}
        onClose={() => setSelectedIcon(null)}
      />
    </>
  )
}
