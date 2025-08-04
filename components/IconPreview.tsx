'use client'

import { useState, useEffect, useRef } from 'react';
import { logger } from '@/lib/logger';
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Download, Code, RotateCcw, Palette, Maximize2, FileDown, Plus, Minus } from 'lucide-react'
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
  const [editedSvgContent, setEditedSvgContent] = useState<string | null>(null)
  const [originalSvgContent, setOriginalSvgContent] = useState<string | null>(null)
  const [iconColor, setIconColor] = useState('#141B34')
  const [iconWidth, setIconWidth] = useState(24)
  const [iconHeight, setIconHeight] = useState(24)
  const [isEditing, setIsEditing] = useState(false)
  const [exportFormat, setExportFormat] = useState<'svg' | 'png'>('svg')
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
    setEditedSvgContent(null);
    setOriginalSvgContent(null);
    setIsEditing(false);
    
    if (icon && isOpen && isMounted.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        // Use your example SVG icon or fetch from URL
        let exampleSvg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M11 2C11 1.44772 11.4477 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 11.4477 1.44772 11 2 11C2.55228 11 3 11.4477 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C11.4477 3 11 2.55228 11 2ZM9.43434 2.14361C9.63116 2.65963 9.37241 3.23751 8.85639 3.43434C8.68765 3.4987 8.52124 3.5678 8.35731 3.64149C7.85358 3.86791 7.26166 3.64311 7.03524 3.13937C6.80881 2.63564 7.03362 2.04372 7.53735 1.8173C7.73645 1.72781 7.9386 1.64386 8.14361 1.56566C8.65963 1.36883 9.23751 1.62759 9.43434 2.14361ZM5.80331 3.96469C6.1824 4.36632 6.16414 4.99922 5.76252 5.37832C5.62995 5.50345 5.50103 5.6324 5.37594 5.76499C4.99694 6.16671 4.36404 6.18514 3.96232 5.80614C3.5606 5.42715 3.54218 4.79425 3.92117 4.39253C4.07278 4.23183 4.22902 4.07555 4.38968 3.9239C4.79131 3.5448 5.42421 3.56307 5.80331 3.96469ZM3.14211 7.03001C3.64574 7.25667 3.87028 7.84868 3.64363 8.35231C3.56916 8.5178 3.49936 8.68582 3.43441 8.85621C3.23768 9.37227 2.65985 9.63114 2.14379 9.43441C1.62773 9.23768 1.36887 8.65985 1.56559 8.14379C1.64453 7.93673 1.72934 7.73257 1.81981 7.53153C2.04646 7.0279 2.63848 6.80336 3.14211 7.03001Z" fill="#141B34"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 7C12.5523 7 13 7.44772 13 8V11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H13V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V13H8C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11H11V8C11 7.44772 11.4477 7 12 7Z" fill="#141B34"/></svg>';
        
        // Use githubPath if available, otherwise fall back to the local path or API URL
        const svgUrl = icon.githubPath || getIconUrl(icon);
        
        // Try to fetch actual SVG content, fallback to example
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
              setOriginalSvgContent(processedSvg);
            }
          })
          .catch(err => {
            logger.error('Error loading SVG:', err);
            // Use example SVG as fallback
            if (isMounted.current) {
              setSvgContent(exampleSvg);
              setOriginalSvgContent(exampleSvg);
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

  // Function to convert SVG to PNG
  const svgToPng = (svgString: string, width: number, height: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }
      
      // Set canvas size (use higher resolution for better quality)
      const scale = 4
      canvas.width = width * scale
      canvas.height = height * scale
      ctx.scale(scale, scale)
      
      const img = new Image()
      
      img.onload = () => {
        // Fill with transparent background
        ctx.clearRect(0, 0, width, height)
        
        // Draw the SVG
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to create PNG blob'))
          }
        }, 'image/png')
      }
      
      img.onerror = () => {
        reject(new Error('Failed to load SVG image'))
      }
      
      // Create data URL from SVG
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)
      img.src = url
    })
  }

  const downloadIcon = async () => {
    if (!icon || !svgContent) {
      toast.error('No icon content available')
      return
    }

    try {
      if (exportFormat === 'png') {
        // Convert SVG to PNG
        const pngBlob = await svgToPng(svgContent, iconWidth * 8, iconHeight * 8) // Higher resolution
        const url = URL.createObjectURL(pngBlob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = `${icon.name}.png`
        document.body.appendChild(link)
        link.click()
        
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        toast.success('PNG downloaded!')
      } else {
        // Download as SVG
        const blob = new Blob([svgContent], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = `${icon.name}.svg`
        document.body.appendChild(link)
        link.click()
        
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        toast.success('SVG downloaded!')
      }
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Download failed. Please try again.')
    }
  }

  // Function to update SVG with new color
  const updateSvgColor = (newColor: string) => {
    if (!svgContent) return
    
    let updatedSvg = svgContent
    
    // Handle different SVG types:
    // - Solid: fill colors only
    // - Stroke: stroke colors only, keep fill="none"
    // - Bulk: mix of fill colors and opacity
    // - Duotone: two colors (primary and secondary)
    // - Twotone: similar to duotone but different structure
    
    const hasStroke = updatedSvg.includes('stroke="') && !updatedSvg.includes('stroke="none"')
    const hasFill = /fill="#[0-9A-Fa-f]{3,6}"/i.test(updatedSvg) // Check for actual hex color fills
    const hasOpacity = updatedSvg.includes('opacity="')
    
    // Check if this is a duotone SVG (has both D4D7E0 and 141B34)
    const isDuotone = (updatedSvg.includes('#D4D7E0') || updatedSvg.includes('#d4d7e0')) && (updatedSvg.includes('#141B34') || updatedSvg.includes('#141b34'))
    
    if (isDuotone) {
      // For Duotone: Handle background and strokes separately
      // Create a much lighter version of the new color for backgrounds
      const hex = newColor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      
      // Create light version by mixing with white (85% white + 15% color)
      const lightR = Math.round(255 * 0.85 + r * 0.15)
      const lightG = Math.round(255 * 0.85 + g * 0.15)
      const lightB = Math.round(255 * 0.85 + b * 0.15)
      
      const lightColor = `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`
      
      // Update background fills to light color
      updatedSvg = updatedSvg.replace(/fill="#D4D7E0"/gi, `fill="${lightColor}"`)
      
      // Update dark strokes to main color
      updatedSvg = updatedSvg.replace(/stroke="#141B34"/gi, `stroke="${newColor}"`)
      updatedSvg = updatedSvg.replace(/fill="#141B34"/gi, `fill="${newColor}"`)
    } else {
      // For non-duotone: Use normal color replacement
      
      // Always update stroke colors if they exist
      if (hasStroke) {
        updatedSvg = updatedSvg.replace(/stroke="#[0-9A-Fa-f]{6}"/g, `stroke="${newColor}"`)
        updatedSvg = updatedSvg.replace(/stroke="#[0-9A-Fa-f]{3}"/g, `stroke="${newColor}"`)
      }
      
      // Always update fill colors if they exist
      if (hasFill) {
        // Replace ALL hex color fills (6-digit and 3-digit)
        updatedSvg = updatedSvg.replace(/fill="#[0-9A-Fa-f]{6}"/g, `fill="${newColor}"`)
        updatedSvg = updatedSvg.replace(/fill="#[0-9A-Fa-f]{3}"/g, `fill="${newColor}"`)
      }
    }
    
    // Fallback: if no colors found, add fill to common elements
    if (!hasStroke && !hasFill) {
      updatedSvg = updatedSvg.replace(/<path(?![^>]*(?:fill|stroke)=)/g, `<path fill="${newColor}"`)
      updatedSvg = updatedSvg.replace(/<circle(?![^>]*(?:fill|stroke)=)/g, `<circle fill="${newColor}"`)
      updatedSvg = updatedSvg.replace(/<rect(?![^>]*(?:fill|stroke)=)/g, `<rect fill="${newColor}"`)
      updatedSvg = updatedSvg.replace(/<ellipse(?![^>]*(?:fill|stroke)=)/g, `<ellipse fill="${newColor}"`)
    }
    
    setSvgContent(updatedSvg)
    setEditedSvgContent(updatedSvg)
    setIsEditing(true)
  }

  // Function to update SVG size
  const updateSvgSize = (width: number, height: number) => {
    if (!svgContent) return
    
    let updatedSvg = svgContent
    updatedSvg = updatedSvg.replace(/width="[^"]*"/, `width="${width}"`)
    updatedSvg = updatedSvg.replace(/height="[^"]*"/, `height="${height}"`)
    
    setSvgContent(updatedSvg)
    setEditedSvgContent(updatedSvg)
    setIsEditing(true)
  }

  // Function to reset to original
  const resetToOriginal = () => {
    if (originalSvgContent) {
      setSvgContent(originalSvgContent)
      setEditedSvgContent(null)
      setIsEditing(false)
      setIconColor('#141B34')
      setIconWidth(24)
      setIconHeight(24)
      toast.success('Reset to original!')
    }
  }

  // Function to export edited icon (SVG or PNG)
  const exportEditedIcon = async () => {
    if (!icon || !editedSvgContent) {
      toast.error('No edited content available')
      return
    }

    try {
      if (exportFormat === 'png') {
        // Convert edited SVG to PNG
        const pngBlob = await svgToPng(editedSvgContent, iconWidth * 8, iconHeight * 8)
        const url = URL.createObjectURL(pngBlob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = `${icon.name}-edited.png`
        document.body.appendChild(link)
        link.click()
        
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        toast.success('Edited PNG exported!')
      } else {
        // Export as SVG
        const blob = new Blob([editedSvgContent], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = `${icon.name}-edited.svg`
        document.body.appendChild(link)
        link.click()
        
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        toast.success('Edited SVG exported!')
      }
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Export failed. Please try again.')
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
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
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

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Icon Display */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-2xl mb-6">
                  {svgContent ? (
                    <div 
                      className="flex items-center justify-center text-gray-700 dark:text-gray-300"
                      style={{
                        width: `${Math.min(iconWidth * 2, 64)}px`,
                        height: `${Math.min(iconHeight * 2, 64)}px`
                      }}
                    >
                      <div
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                        style={{ 
                          width: `${iconWidth}px`, 
                          height: `${iconHeight}px`, 
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
                  {isEditing ? `Edited: ${iconWidth}×${iconHeight}px` : 'Original size and colors preserved'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Format Selector */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Export Format:</label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as 'svg' | 'png')}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                  >
                    <option value="svg">SVG</option>
                    <option value="png">PNG</option>
                  </select>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={downloadIcon}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download {exportFormat.toUpperCase()}</span>
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
              </div>

              {/* SVG Editor Controls */}
              {svgContent && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                    <Palette className="w-4 h-4 mr-2" />
                    SVG Editor
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Color Controls */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Icon Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={iconColor}
                          onChange={(e) => {
                            setIconColor(e.target.value)
                            updateSvgColor(e.target.value)
                          }}
                          className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={iconColor}
                          onChange={(e) => {
                            setIconColor(e.target.value)
                            updateSvgColor(e.target.value)
                          }}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                          placeholder="#141B34"
                        />
                      </div>
                    </div>

                    {/* Size Controls */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Size (width, height auto)
                      </label>
                      <div className="flex items-center space-x-2">
                        {/* Decrease button */}
                        <button
                          onClick={() => {
                            const newWidth = Math.max(8, iconWidth - 4)
                            setIconWidth(newWidth)
                            setIconHeight(newWidth)
                            updateSvgSize(newWidth, newWidth)
                          }}
                          className="flex items-center justify-center w-8 h-8 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                          disabled={iconWidth <= 8}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        
                        {/* Size display */}
                        <div className="flex items-center justify-center min-w-[80px] px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{iconWidth}px</span>
                        </div>
                        
                        {/* Increase button */}
                        <button
                          onClick={() => {
                            const newWidth = Math.min(256, iconWidth + 4)
                            setIconWidth(newWidth)
                            setIconHeight(newWidth)
                            updateSvgSize(newWidth, newWidth)
                          }}
                          className="flex items-center justify-center w-8 h-8 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                          disabled={iconWidth >= 256}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        
                        <span className="text-xs text-gray-500">(square)</span>
                      </div>
                    </div>
                  </div>

                  {/* Editor Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      onClick={resetToOriginal}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                    
                    {isEditing && editedSvgContent && (
                      <button
                        onClick={exportEditedIcon}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors"
                      >
                        <FileDown className="w-3 h-3" />
                        <span>Export Edited {exportFormat.toUpperCase()}</span>
                      </button>
                    )}
                  </div>

                  {isEditing && (
                    <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        ✨ Icon has been edited! Use "Export Edited" to download with "-edited" suffix.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Code Preview */}
              {svgContent && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isEditing ? 'Edited SVG Code' : 'SVG Code'}
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
