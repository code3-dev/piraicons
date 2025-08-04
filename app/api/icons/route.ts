import { NextRequest, NextResponse } from 'next/server'
import { getIconService } from '@/lib/serviceConfig';
import { logger } from '@/lib/logger';

// Make this route dynamic to avoid static generation issues
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Use searchParams directly from the request object
    const query = request.nextUrl.searchParams.get('q') || ''
    const category = request.nextUrl.searchParams.get('category') || undefined
    const subcategory = request.nextUrl.searchParams.get('subcategory') || undefined
    const tag = request.nextUrl.searchParams.get('tag') || undefined
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1')
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50')
    // Keep offset for backward compatibility
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0')

    const iconService = getIconService()
    // Use fastSearchIcons instead of searchIcons to avoid including SVG content
    // This significantly reduces the response size
    const results = await iconService.fastSearchIcons(query, {
      category,
      subcategory,
      tag,
      page,
      limit
    })

    // For backward compatibility, apply additional offset if provided
    const finalIcons = offset > 0 ? results.icons.slice(offset) : results.icons

    return NextResponse.json({
      icons: finalIcons,
      totalCount: results.totalCount,
      categories: results.categories,
      tags: results.tags,
      pagination: results.pagination || {
        // Fallback for backward compatibility
        limit,
        offset,
        page,
        totalPages: Math.ceil(results.totalCount / limit),
        hasMore: (page * limit) < results.totalCount
      }
    })
  } catch (error) {
    logger.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch icons' },
      { status: 500 }
    )
  }
}
