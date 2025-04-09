import { defineDocumentType, ComputedFields, makeSource } from 'contentlayer2/source-files'
import { writeFileSync } from 'fs'
import readingTime from 'reading-time'
import GithubSlugger from 'github-slugger'
import path from 'path'
// Remark packages
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import {
  remarkExtractFrontmatter,
  remarkCodeTitles,
  remarkImgToJsx,
  extractTocHeadings,
} from 'pliny/mdx-plugins/index.js'
// Rehype packages
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeCitation from 'rehype-citation'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypePresetMinify from 'rehype-preset-minify'
import siteMetadata from './data/siteMetadata'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer.js'
import { visit } from 'unist-util-visit'
import { h } from 'hastscript'
import type { Element, Text } from 'hast'

const root = process.cwd()
const isProduction = process.env.NODE_ENV === 'production'

const computedFields: ComputedFields = {
  readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, ''),
  },
  path: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath,
  },
  filePath: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFilePath,
  },
  toc: { type: 'string', resolve: (doc) => extractTocHeadings(doc.body.raw) },
}

/**
 * Count the occurrences of all tags across blog posts and write to json file
 */
function createTagCount(allBlogs) {
  const tagCount: Record<string, number> = {}
  allBlogs.forEach((file) => {
    if (file.tags && (!isProduction || file.draft !== true)) {
      file.tags.forEach((tag) => {
        const formattedTag = new GithubSlugger().slug(tag)
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1
        } else {
          tagCount[formattedTag] = 1
        }
      })
    }
  })
  writeFileSync('./app/tag-data.json', JSON.stringify(tagCount))
}

function createSearchIndex(allBlogs) {
  if (
    siteMetadata?.search?.provider === 'kbar' &&
    siteMetadata.search.kbarConfig.searchDocumentsPath
  ) {
    writeFileSync(
      `public/${siteMetadata.search.kbarConfig.searchDocumentsPath}`,
      JSON.stringify(allCoreContent(sortPosts(allBlogs)))
    )
    console.log('Local search index generated...')
  }
}

// Custom plugin to make bibliography URLs clickable (Corrected Version)
const rehypeLinkifyBibUrls = () => {
  return (tree) => {
    visit(tree, 'element', (node: Element) => {
      // Target bibliography entry divs
      const className = node.properties?.className
      const isCslEntry = 
        (typeof className === 'string' && className.includes('csl-entry')) ||
        (Array.isArray(className) && className.some(cn => typeof cn === 'string' && cn.includes('csl-entry')))

      if (node.tagName === 'div' && isCslEntry) {
        const urlRegex = /(https?:\/\/[^\s{}]+)/g
        const newChildren: (Element | Text)[] = []

        node.children.forEach((child) => {
          if (child.type === 'text') {
            let lastIndex = 0
            let match
            urlRegex.lastIndex = 0

            while ((match = urlRegex.exec(child.value)) !== null) {
              // Add text before the match
              if (match.index > lastIndex) {
                newChildren.push({ type: 'text', value: child.value.slice(lastIndex, match.index) })
              }
              // Add the link using hastscript
              const url = match[0]
              // Ensure the result of h() is treated as Element
              newChildren.push(
                h('a', { href: url, target: '_blank', rel: 'noopener noreferrer' }, url) as Element
              )
              lastIndex = match.index + url.length
            }

            // Add any remaining text after the last match
            if (lastIndex < child.value.length) {
              newChildren.push({ type: 'text', value: child.value.slice(lastIndex) })
            }
          } else {
            // Keep other non-text nodes (like existing links, italics, etc.)
            // Ensure the child is correctly typed when pushed
            newChildren.push(child as Element | Text)
          }
        })

        // Replace the original children with the new list containing links
        node.children = newChildren
      }
    })
  }
}

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    lastmod: { type: 'date' },
    draft: { type: 'boolean' },
    summary: { type: 'string' },
    images: { type: 'json' },
    thumbnail: { type: 'string' },
    authors: { type: 'list', of: { type: 'string' } },
    layout: { type: 'string' },
    bibliography: { type: 'string' },
    canonicalUrl: { type: 'string' },
  },
  computedFields: {
    ...computedFields,
    structuredData: {
      type: 'json',
      resolve: (doc) => ({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: doc.title,
        datePublished: doc.date,
        dateModified: doc.lastmod || doc.date,
        description: doc.summary,
        image: doc.thumbnail || (doc.images ? doc.images[0] : undefined),
        url: `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`,
      }),
    },
  },
}))

export const Authors = defineDocumentType(() => ({
  name: 'Authors',
  filePathPattern: 'authors/**/*.mdx',
  contentType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    avatar: { type: 'string' },
    occupation: { type: 'string' },
    company: { type: 'string' },
    email: { type: 'string' },
    twitter: { type: 'string' },
    linkedin: { type: 'string' },
    github: { type: 'string' },
    layout: { type: 'string' },
  },
  computedFields,
}))

export default makeSource({
  contentDirPath: 'data',
  documentTypes: [Blog, Authors],
  mdx: {
    cwd: process.cwd(),
    remarkPlugins: [
      remarkExtractFrontmatter,
      remarkGfm,
      remarkCodeTitles,
      remarkMath,
      remarkImgToJsx,
    ],
    rehypePlugins: [
      rehypeSlug,
      rehypeAutolinkHeadings,
      rehypeKatex,
      [rehypeCitation, { path: path.join(root, 'data', 'blog'), linkCitations: true }],
      rehypeLinkifyBibUrls,
      [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
      rehypePresetMinify,
    ],
  },
  onSuccess: async (importData) => {
    const { allDocuments } = await importData()
    const allBlogs = allDocuments.filter(doc => doc.type === 'Blog')
    createTagCount(allBlogs)
    createSearchIndex(allBlogs)
  },
})
