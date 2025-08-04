import { NextResponse } from 'next/server'
import { getIconService } from '@/lib/serviceConfig';
import { logger } from '@/lib/logger';

// Make this route dynamic to avoid static generation issues
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const iconService = getIconService()
    
    // Use the lightweight categories method to avoid including SVG content
    // This significantly reduces the response size
    const categories = await iconService.getLightCategories()
    
    return NextResponse.json({
      categories,
      totalCategories: categories.length,
      totalIcons: categories.reduce((sum, cat) => sum + cat.iconCount, 0)
    })
  } catch (error) {
    logger.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
