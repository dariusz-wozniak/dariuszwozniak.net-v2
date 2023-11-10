import React from 'react'

interface ArticleImageProps {
  src: string
  alt?: string
  className?: string
}

const ArticleImage: React.FC<ArticleImageProps> = ({ src, alt, className }) => {
  if (!className) {
    className = 'article-image'
  }

  if (!alt) {
    const parts = src.split('/')
    const filename = parts[parts.length - 1]
    alt = filename.split('.')[0].replace(/-/g, ' ')
  }

  // return figure with figcaption:
  return (
    <figure className={'article-fig'}>
      <img src={src} alt={alt} className={className + 'article-fig'} />
      <figcaption className={'article-fig'}>Image: {alt}</figcaption>
    </figure>
  )
}

export default ArticleImage
