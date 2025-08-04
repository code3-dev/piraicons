# Deployment Guide

## Vercel Deployment

This application is optimized for deployment on Vercel. Follow these steps for a successful deployment:

### Handling Oversized ISR Pages

The application has been optimized to avoid the "Oversized Incremental Static Regeneration (ISR) page" error that can occur when deploying to Vercel. This error happens when pre-rendered responses are larger than Vercel's limit of 19.07 MB.

#### Fixes Implemented

1. **API Route Optimizations**:
   - Changed API routes to use lightweight data methods that exclude SVG content from responses
   - Replaced `getCategories()` with `getLightCategories()` in API routes
   - Replaced `searchIcons()` with `fastSearchIcons()` in search endpoints
   - Removed unnecessary `revalidate` settings from API routes

2. **Next.js Configuration**:
   - Added optimizations in `next.config.js` for CSS and package imports
   - Set appropriate static generation timeout

3. **Temporary Workaround**:
   - Added `.env.local` with `VERCEL_BYPASS_FALLBACK_OVERSIZED_ERROR=1` as a temporary measure

### Deployment Steps

1. Push your changes to your Git repository
2. Connect your repository to Vercel
3. Configure the following environment variables in Vercel:
   - Any database connection strings or API keys needed by your application
   - `VERCEL_BYPASS_FALLBACK_OVERSIZED_ERROR=1` (temporary, can be removed after confirming deployment works)

4. Deploy your application

### Monitoring and Troubleshooting

After deployment, monitor your application logs in the Vercel dashboard. If you encounter any issues:

1. Check that all API routes are using the lightweight data methods
2. Verify that no route is returning excessive data
3. Consider implementing pagination for large data sets

### Future Optimizations

Consider these additional optimizations for better performance:

1. Implement client-side pagination for large icon sets
2. Use image optimization for SVG content
3. Consider using a CDN for serving static icon files