import { NextRequest, NextResponse } from 'next/server';
import { DbIconService } from '@/lib/dbService';
import { logger } from '@/lib/logger';

// Make this route dynamic to avoid static generation issues
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type') || 'full';
    const categoryName = request.nextUrl.searchParams.get('category') || undefined;
    const subcategoryName = request.nextUrl.searchParams.get('subcategory') || undefined;
    
    // Different response types based on the 'type' parameter
    switch (type) {
      case 'categories':
        // Return only categories (lightweight)
        const categories = await DbIconService.getLightCategories();
        return NextResponse.json({
          categories,
          totalCategories: categories.length,
          totalIcons: categories.reduce((sum, cat) => sum + cat.iconCount, 0)
        });
        
      case 'subcategories':
        // Return subcategories, optionally filtered by category
        const subcategories = await DbIconService.getLightSubcategories(categoryName);
        return NextResponse.json({
          subcategories,
          totalSubcategories: subcategories.length,
          categoryName
        });
        
      case 'tags':
        // Return tags, optionally filtered by category and subcategory
        const tags = await DbIconService.getLightTags(categoryName, subcategoryName);
        return NextResponse.json({
          tags,
          totalTags: tags.length,
          categoryName,
          subcategoryName
        });
        
      case 'full':
      default:
        // Return full structure (categories, subcategories, tags) without icons
        const structure = await DbIconService.getCategoryStructure();
        return NextResponse.json({
          categories: structure,
          totalCategories: structure.length,
          totalIcons: structure.reduce((sum, cat) => sum + cat.iconCount, 0)
        });
    }
  } catch (error) {
    logger.error('API DB Structure Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch structure from database', details: (error as Error).message },
      { status: 500 }
    );
  }
}