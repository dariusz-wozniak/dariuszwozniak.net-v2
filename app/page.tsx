import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'

export default function Page() {
  // Sort posts by date
  let sortedPosts = sortPosts(allBlogs)
  
  // Runtime filtering - this happens on each request
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  
  sortedPosts = sortedPosts.filter((post) => {
    const postDate = new Date(post.date)
    postDate.setUTCHours(0, 0, 0, 0)
    return postDate <= today
  })
  
  const posts = allCoreContent(sortedPosts)
  return <Main posts={posts} />
}
