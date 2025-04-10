import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'
import { filterPostsByPublishDate } from './utils'

export default async function Page() {
  let sortedPosts = sortPosts(allBlogs)
  sortedPosts = filterPostsByPublishDate(sortedPosts)
  const posts = allCoreContent(sortedPosts)
  return <Main posts={posts} />
}
