import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'

const isProduction = process.env.NODE_ENV === 'production'

export default async function Page() {
  let sortedPosts = sortPosts(allBlogs)
  if (isProduction) {
    const today = new Date()
    today.setHours(12, 0, 0, 0)
    sortedPosts = sortedPosts.filter((post) => {
      return new Date(post.date) <= today
    })
  }
  const posts = allCoreContent(sortedPosts)
  return <Main posts={posts} />
}
