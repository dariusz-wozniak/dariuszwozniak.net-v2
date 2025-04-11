import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { genPageMetadata } from 'app/seo'

const POSTS_PER_PAGE = 10

export const metadata = genPageMetadata({ title: 'Blog' })

export default function BlogPage() {
  // Sort posts by date
  let posts = sortPosts(allBlogs)
  
  // Runtime filtering - this happens on each request
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  
  posts = posts.filter((post) => {
    const postDate = new Date(post.date)
    postDate.setUTCHours(0, 0, 0, 0)
    return postDate <= today
  })
  
  const filteredPosts = allCoreContent(posts)

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
