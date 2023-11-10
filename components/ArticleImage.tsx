import React from 'react'

interface ArticleImageProps {
  src: string
  alt?: string
  className?: string
}

const ArticleImage = (props: ArticleImageProps) => {
  let className = props.className

  if (!props.className) {
    className = 'article-image'
  }

  let alt = props.alt

  if (!props.alt) {
    const parts = props.src.split('/')
    const filename = parts[parts.length - 1]
    alt = filename.split('.')[0].replace(/-/g, ' ')
  }

  return (
    <figure className={'article-fig'}>
      <img src={props.src} alt={alt} className={className + ' article-fig'} />
      <figcaption className={'article-fig'}>Image: {alt}</figcaption>
    </figure>
  )
}

export default ArticleImage
