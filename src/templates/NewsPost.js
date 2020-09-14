import React, { Fragment } from 'react'
import _ from 'lodash'
import { Link, graphql } from 'gatsby'
import { ChevronLeft } from 'react-feather'
import PostSection from '../components/PostSection'
import PageHeader from '../components/PageHeader'
import Content from '../components/Content'
import Layout from '../components/Layout'
import {getRelatedPosts} from '../components/RelatedPosts'
import './SinglePost.css'

export const NewsPostTemplate = ({
    title,
    featuredImage,
    localImage,
    date,
    body,
    nextPostURL,
    prevPostURL,
    categories = []
}) => {
    let pageFeaturedImage = featuredImage.startsWith('http')?featuredImage:('../'+featuredImage);
    if(localImage && localImage.childImageSharp) pageFeaturedImage = localImage.childImageSharp.fluid.src;
    return (
        <main>
            <PageHeader
                backgroundImage={pageFeaturedImage}
            />
            <article
                className="SinglePost section light"
                itemScope
                itemType="http://schema.org/BlogPosting"
            >
                <div className="container skinny">
                    <Link className="SinglePost--BackButton" to="/blog/">
                        <ChevronLeft /> BACK
                    </Link>
                    <div className="SinglePost--Content relative">
                        <div className="SinglePost--Meta">
                            {date}
                            {categories && (
                                <Fragment>
                                    <span> |</span>
                                    {categories.map((cat, index) => (
                                        <span
                                            key={cat.category}
                                            className="SinglePost--Meta--Category"
                                        >
                                            {cat.category}
                                            {/* Add a comma on all but last category */}
                                            {index !== categories.length - 1 ? ',' : ''}
                                        </span>
                                    ))}
                                </Fragment>
                            )}
                        </div>

                        {title && (
                            <h1 className="SinglePost--Title" itemProp="title">
                                {title}
                            </h1>
                        )}

                        <div className="SinglePost--InnerContent">
                            <Content source={body} />
                        </div>

                        <div className="SinglePost--Pagination">
                            {prevPostURL && (
                                <Link
                                    className="SinglePost--Pagination--Link prev"
                                    to={prevPostURL}
                                >
                                    Previous Post
                                </Link>
                            )}
                            {nextPostURL && (
                                <Link
                                    className="SinglePost--Pagination--Link next"
                                    to={nextPostURL}
                                >
                                    Next Post
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </article>
        </main>
    )
}

// Export Default NewsPost for front-end
const NewsPost = ({ data: { post } }) => {
    
    return (
        <Layout
            meta={post.frontmatter.meta || false}
            description={post.excerpt || false}
            title={post.frontmatter.title || false}
        >
            <NewsPostTemplate
                {...post}
                {...post.frontmatter}
                body={post.html}
                nextPostURL={_.get(thisEdge, 'next.id')}
                prevPostURL={_.get(thisEdge, 'previous.id')}
            />
        </Layout>
    )
}

export default NewsPost

export const pageQuery = graphql`
  ## Query for NewsPost data
  ## Use GraphiQL interface (http://localhost:8000/___graphql)
  ## $id is processed via gatsby-node.js
  ## query name must be unique to this file
  query NewsPost($id: String!) {
    post: googleSheetListRow(id: { eq: $id }) {
      articleid
      author
      comment
      d415A
      dateadded
      excerpt
      extractedkeywords
      highlight
      highlight2
      image
      images
      id
      keywords
      publishdate
      relativepopularity
      source
      source2
      tags
      text
      title
      url 
    }
  }
`
