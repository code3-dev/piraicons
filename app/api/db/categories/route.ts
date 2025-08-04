import { NextResponse } from 'next/server';
import { DbIconService } from '@/lib/dbService';
import { logger } from '@/lib/logger';

// Make this route dynamic to avoid static generation issues
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Use the lightweight categories method to avoid including SVG content
    // This significantly reduces the response size
    const categories = await DbIconService.getLightCategories();
    
    return NextResponse.json({
      categories,
      totalCategories: categories.length,
      totalIcons: categories.reduce((sum, cat) => sum + cat.iconCount, 0)
    });
  } catch (error) {
    logger.error('API DB Categories Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories from database' },
      { status: 500 }
    );
  }
}