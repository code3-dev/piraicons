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
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '100')
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0')

    const iconService = getIconService()
    // Use fastSearchIcons instead of searchIcons to avoid including SVG content
    // This significantly reduces the response size
    const results = await iconService.fastSearchIcons(query, {
      category,
      subcategory,
      tag
    })

    // Apply pagination
    const paginatedIcons = results.icons.slice(offset, offset + limit)

    return NextResponse.json({
      icons: paginatedIcons,
      totalCount: results.totalCount,
      categories: results.categories,
      tags: results.tags,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < results.totalCount
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
