import { NextRequest, NextResponse } from 'next/server';
import { DbIconService } from '@/lib/dbService';
import { logger } from '@/lib/logger';

// Make this route dynamic to avoid static generation issues
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Reconstruct the path from the path segments
    const pathSegments = params.path;
    const iconPath = `/assets/${pathSegments.join('/')}`;
    
    // Get the SVG content from the database
    const svgContent = await DbIconService.getIconSvg(iconPath);
    
    if (!svgContent) {
      return NextResponse.json(
        { error: 'SVG not found in database' },
        { status: 404 }
      );
    }
    
    // Return the SVG content with the correct content type
    return new NextResponse(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
      }
    });
  } catch (error) {
    logger.error('API DB SVG Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SVG from database' },
      { status: 500 }
    );
  }
}