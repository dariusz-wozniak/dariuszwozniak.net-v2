import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import ArticleImage from './ArticleImage'
import { Note, Tip, Important, Warning, Caution } from './Admonitions'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  BlogNewsletterForm,
  ArticleImage,
  Note,
  Tip,
  Important,
  Warning,
  Caution,
}
