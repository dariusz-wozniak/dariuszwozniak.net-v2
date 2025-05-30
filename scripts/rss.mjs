import {writeFileSync, mkdirSync} from 'fs'
import path from 'path'
import GithubSlugger from 'github-slugger'
import {escape} from 'pliny/utils/htmlEscaper.js'
import siteMetadata from '../data/siteMetadata.js'
import tagData from '../app/tag-data.json' assert {type: 'json'}
import {allBlogs} from '../.contentlayer/generated/index.mjs'
import {sortPosts} from 'pliny/utils/contentlayer.js'

// Define the constant here to avoid importing from TypeScript
const SCHEDULED_POST_PUBLISH_HOUR = 7 // 7 AM UTC

const githubSlugger = new GithubSlugger()

const generateRssItem = (config, post) => `
  <item>
    <guid>${config.siteUrl}/blog/${post.slug}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}/blog/${post.slug}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
        <pubDate>${post.date ? new Date(post.date).toUTCString() : ''}</pubDate>
    <author>${config.author}</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`

const generateRss = (config, posts, page = 'feed.xml') => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}/blog</link>
      <description>${escape(config.description)}</description>
      <language>${config.language}</language>
      <managingEditor>${config.email}${config.author}</managingEditor>
      <webMaster>${config.email}${config.author}</webMaster>
      <lastBuildDate>${posts[0]?.date ? new Date(posts[0].date).toUTCString() : ''}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(config, post)).join('')}
    </channel>
  </rss>
`

async function generateRSS(config, allBlogs, page = 'feed.xml') {
    let publishPosts = allBlogs.filter((post) => post.draft !== true)

    // Filter out posts with future dates
    const today = new Date()
    today.setHours(SCHEDULED_POST_PUBLISH_HOUR, 0, 0, 0) // Use configured UTC time for date comparison
    publishPosts = publishPosts.filter((post) => {
      const postDate = new Date(post.date)
      postDate.setHours(SCHEDULED_POST_PUBLISH_HOUR, 0, 0, 0)
      return postDate <= today
    })

    // RSS for blog post
    if (publishPosts.length > 0) {
        const rss = generateRss(config, sortPosts(publishPosts))
        writeFileSync(`./public/${page}`, rss)
    }

    if (publishPosts.length > 0) {
        for (const tag of Object.keys(tagData)) {
            let filteredPosts = allBlogs.filter((post) =>
                post.draft !== true && // Ensure draft posts are still excluded
                post.tags &&
                post.tags.map((t) => githubSlugger.slug(t)).includes(tag)
            )

            // Also filter tag-specific posts by date
            filteredPosts = filteredPosts.filter((post) => {
              const postDate = new Date(post.date)
              postDate.setHours(SCHEDULED_POST_PUBLISH_HOUR, 0, 0, 0)
              return postDate <= today
            })

            if (filteredPosts.length > 0) { // Only generate tag feed if there are posts
              const rss = generateRss(config, sortPosts(filteredPosts), `tags/${tag}/${page}`)
              const rssPath = path.join('public', 'tags', tag)
              mkdirSync(rssPath, {recursive: true})
              writeFileSync(path.join(rssPath, page), rss)
            }
        }
    }
}

const rss = () => {
    generateRSS(siteMetadata, allBlogs)
    console.log('RSS feed generated...')
}
export default rss
