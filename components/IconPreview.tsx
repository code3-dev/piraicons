'use client'

import { useState, useEffect, useRef } from 'react';
import { logger } from '@/lib/logger';
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Download, Code } from 'lucide-react'
import { IconFile } from '@/types/icons'
import toast from 'react-hot-toast'
import { getIconService } from '@/lib/serviceConfig'

interface IconPreviewProps {
  icon: IconFile | null
  isOpen: boolean
  onClose: () => void
}

export default function IconPreview({ icon, isOpen, onClose }: IconPreviewProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null)
  const isMounted = useRef(false)
  
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

  // Set mounted flag when component mounts (client-side only)
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Load SVG content only after component is mounted
  useEffect(() => {
    // Reset SVG content when modal opens/closes or icon changes
    setSvgContent(null);
    
    if (icon && isOpen && isMounted.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        // Use githubPath if available, otherwise fall back to the local path or API URL
        const svgUrl = icon.githubPath || getIconUrl(icon);
        
        // Fetch SVG content
        fetch(svgUrl)
          .then(res => {
            if (!res.ok) {
              throw new Error(`Failed to fetch SVG: ${res.status} ${res.statusText}`);
            }
            return res.text();
          })
          .then(svg => {
            if (isMounted.current) {
              // Process SVG to ensure it has proper viewBox and size attributes
              let processedSvg = svg;
              
              // Extract SVG tag to properly handle attributes
              const svgTagMatch = processedSvg.match(/<svg[^>]*>/);
              if (svgTagMatch) {
                let svgTag = svgTagMatch[0];
                let newSvgTag = svgTag;
                
                // If SVG doesn't have viewBox, add one
                if (!processedSvg.includes('viewBox')) {
                  newSvgTag = newSvgTag.replace('<svg', '<svg viewBox="0 0 24 24"');
                }
                
                // Add width and height if not present
                if (!processedSvg.includes('width=')) {
                  newSvgTag = newSvgTag.replace('<svg', '<svg width="24"');
                }
                
                if (!processedSvg.includes('height=')) {
                  newSvgTag = newSvgTag.replace('<svg', '<svg height="24"');
                }
                
                // Replace original SVG tag with new one
                processedSvg = processedSvg.replace(svgTag, newSvgTag);
              }
              
              setSvgContent(processedSvg);
            }
          })
          .catch(err => {
            logger.error('Error loading SVG:', err);
            // Set empty SVG content to show error state
            if (isMounted.current) {
              setSvgContent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>');
            }
          });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [icon, isOpen])

  const copyPath = () => {
    if (icon) {
      // Use githubPath if available, otherwise fall back to the local path or API URL
      const iconUrl = icon.githubPath || getIconUrl(icon);
      navigator.clipboard.writeText(iconUrl)
      toast.success('Link copied to clipboard!')
    }
  }

  const copySvg = () => {
    if (svgContent) {
      navigator.clipboard.writeText(svgContent)
      toast.success('SVG code copied to clipboard!')
    }
  }

  const downloadIcon = () => {
    if (icon && svgContent) {
      // Create a Blob from the SVG content
      const blob = new Blob([svgContent], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      
      // Create a download link
      const link = document.createElement('a')
      link.href = url
      link.download = icon.filename || `${icon.name}.svg`
      document.body.appendChild(link)
      link.click()
      
      // Clean up
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success('Icon downloaded!')
    } else if (icon) {
      // Fallback if SVG content is not available
      const link = document.createElement('a')
      const downloadUrl = icon.githubPath || getIconUrl(icon)
      
      // Use fetch to get the content as a blob
      fetch(downloadUrl)
        .then(response => response.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob)
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
  }

  if (!icon) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {icon.name}
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                    {icon.category}
                  </span>
                  <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
                    {icon.subcategory}
                  </span>
                  <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                    {icon.tag}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Icon Display */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-2xl mb-6">
                  {svgContent ? (
                    <div 
                      className="w-16 h-16 flex items-center justify-center text-gray-700 dark:text-gray-300"
                    >
                      <div
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}
                      />
                    </div>
                  ) : (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Original size and colors preserved
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={downloadIcon}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                
                <button
                  onClick={copyPath}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </button>
                
                <button
                  onClick={copySvg}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Code className="w-4 h-4" />
                  <span>Copy SVG</span>
                </button>
              </div>

              {/* Code Preview */}
              {svgContent && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SVG Code
                  </h3>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-lg overflow-auto max-h-32 border border-gray-200 dark:border-gray-600">
                    <code className="text-gray-800 dark:text-gray-200">{svgContent}</code>
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
