import { notFound } from 'next/navigation'
import { getIconService } from '@/lib/serviceConfig'
import Header from '@/components/Header'
import SearchResults from '@/components/SearchResults'

interface TagPageProps {
  params: {
    tag: string
  }
  searchParams: {
    q?: string
  }
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { tag } = params
  const tagName = tag.charAt(0).toUpperCase() + tag.slice(1)
  
  // Validate tag exists
  const iconService = getIconService()
  const allTags = await iconService.getLightTags()
  const validTag = allTags.find(t => t.name.toLowerCase() === tag.toLowerCase())
  
  if (!validTag) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <SearchResults 
          searchParams={{
            ...searchParams,
            tag: tagName
          }} 
        />
      </main>
    </div>
  )
}

export async function generateStaticParams() {
  // Get all tags from MongoDB
  const iconService = getIconService()
  const tags = await iconService.getLightTags()
  
  return tags.map((tag) => ({
    tag: tag.name.toLowerCase(),
  }))
}