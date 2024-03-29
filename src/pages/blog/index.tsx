import Link from 'next/link'
import Header from '../../components/header'

import blogStyles from '../../styles/blog.module.css'
import sharedStyles from '../../styles/shared.module.css'

import {
  getBlogLink,
  getDateMD,
  getDateYear,
  postIsPublished,
} from '../../lib/blog-helpers'
import { textBlock } from '../../lib/notion/renderers'
import getNotionUsers from '../../lib/notion/getNotionUsers'
import getBlogIndex from '../../lib/notion/getBlogIndex'

export async function getStaticProps({ preview }) {
  const postsTable = await getBlogIndex()

  const authorsToGet: Set<string> = new Set()
  const posts: any[] = Object.keys(postsTable)
    .map(slug => {
      const post = postsTable[slug]
      // remove draft posts in production
      if (!preview && !postIsPublished(post)) {
        return null
      }
      post.Authors = post.Authors || []
      for (const author of post.Authors) {
        authorsToGet.add(author)
      }
      return post
    })
    .filter(Boolean)

  const { users } = await getNotionUsers([...authorsToGet])

  posts.map(post => {
    post.Authors = post.Authors.map(id => users[id].full_name)
  })

  return {
    props: {
      preview: preview || false,
      posts,
    },
    revalidate: 10,
  }
}

export default ({ posts = [], preview }) => {
  return (
    <>
      <div className="container">
        <Header titlePre="BLOG" />
        {preview && (
          <div className={blogStyles.previewAlertContainer}>
            <div className={blogStyles.previewAlert}>
              <b>Note:</b>
              {` `}Viewing in preview mode{' '}
              <Link href={`/api/clear-preview`}>
                <button className={blogStyles.escapePreview}>
                  Exit Preview
                </button>
              </Link>
            </div>
          </div>
        )}
        <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
          {posts.length === 0 && (
            <p className={blogStyles.noPosts}>There are no posts yet</p>
          )}
          {posts.map(post => {
            return (
              <div className={blogStyles.postPreview} key={post.Slug}>
                <div className={blogStyles.postPreviewDate}>
                  {post.Date && (
                    <span className={blogStyles.postPreviewDateMD}>
                      {getDateMD(post.Date)}
                    </span>
                  )}
                  {post.Date && (
                    <span className={blogStyles.postPreviewDateYear}>
                      {getDateYear(post.Date)}
                    </span>
                  )}
                </div>
                <div className={blogStyles.postPreviewContent}>
                  <Link href="/blog/[slug]" as={getBlogLink(post.Slug)}>
                    <h3>{post.Page}</h3>
                  </Link>
                  <p>
                    {(!post.preview || post.preview.length === 0) &&
                      'No preview available'}
                    {(post.preview || []).map((block, idx) =>
                      textBlock(block, true, `${post.Slug}${idx}`)
                    )}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
