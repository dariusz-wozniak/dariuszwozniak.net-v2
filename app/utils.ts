import { SCHEDULED_POST_PUBLISH_HOUR } from './config';
import type { Blog } from 'contentlayer/generated'

/**
 * Filters posts based on publication date compared to current date
 * Uses the configured publication hour (SCHEDULED_POST_PUBLISH_HOUR)
 */
export function filterPostsByPublishDate(posts: Blog[]) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!isProduction) {
    return posts;
  }
  
  const today = new Date();
  today.setHours(SCHEDULED_POST_PUBLISH_HOUR, 0, 0, 0);
  
  return posts.filter((post) => {
    const postDate = new Date(post.date);
    postDate.setHours(SCHEDULED_POST_PUBLISH_HOUR, 0, 0, 0);
    return postDate <= today;
  });
} 