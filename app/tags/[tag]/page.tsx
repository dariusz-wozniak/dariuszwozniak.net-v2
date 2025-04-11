import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allBlogs } from 'contentlayer/generated'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const tag = decodeURI(params.tag)
  return genPageMetadata({
    title: tag,
    description: `${siteMetadata.title} ${tag} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
  })
}

export const generateStaticParams = async () => {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const paths = tagKeys.map((tag) => ({
    tag: tag,
  }))
  return paths
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const tag = params.tag
  // Capitalize first letter and convert spaces to hyphens
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  
  let sortedPosts = sortPosts(allBlogs)
  
  // Runtime filtering - this happens on each request
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  
  sortedPosts = sortedPosts.filter((post) => {
    const postDate = new Date(post.date)
    postDate.setUTCHours(0, 0, 0, 0)
    return postDate <= today
  })
  
  // Filter by tags
  const posts = allCoreContent(
    sortedPosts.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag))
  )

  // If the tag doesn't exist, return not found
  if (posts.length === 0) {
    return (
      <div className="mt-24 text-center">
        <h2 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          No posts found
        </h2>
      </div>
    )
  }

  return <ListLayout posts={posts} title={title} />
}
