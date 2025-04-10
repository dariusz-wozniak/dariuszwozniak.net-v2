import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import { SCHEDULED_POST_PUBLISH_HOUR } from 'app/config'

const POSTS_PER_PAGE = 10

export const metadata = genPageMetadata({ title: 'Blog' })

export default function BlogPage() {
  const posts = allCoreContent(sortPosts(allBlogs))

  const isProduction = process.env.NODE_ENV === 'production'
  const filteredPosts = isProduction
    ? posts.filter((post) => {
        const postDate = new Date(post.date)
        postDate.setHours(SCHEDULED_POST_PUBLISH_HOUR, 0, 0, 0) // Ensure comparison is date-only, not time-sensitive
        const today = new Date()
        today.setHours(SCHEDULED_POST_PUBLISH_HOUR, 0, 0, 0)
        return postDate <= today
      })
    : posts

  const pageNumber = 1
  const initialDisplayPosts = filteredPosts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(filteredPosts.length / POSTS_PER_PAGE),
  }

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  )
}
