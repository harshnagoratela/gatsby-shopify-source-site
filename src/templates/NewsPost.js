import React, { Fragment } from 'react'
import _ from 'lodash'
import { Link, graphql } from 'gatsby'
import { ChevronLeft } from 'react-feather'
import PostSection from '../components/PostSection'
import PageHeader from '../components/PageHeader'
import Content from '../components/Content'
import Layout from '../components/Layout'
import {getRelatedNews} from '../components/RelatedNews'
import './SinglePost.css'

export const NewsPostTemplate = ({
    author,
    comment,
    dateadded,
    excerpt,
    extractedkeywords,
    headerimage,
    highlight,
    highlight2,
    images,
    image,
    id,
    keywords,
    publishdate,
    relativepopularity,
    source,
    source2,
    tags,
    title,
    url,
    body,
    nextPostURL,
    articleid,
    prevPostURL,
    categories = (extractedkeywords + "," + tags + "," + keywords).split(",")
}) => {
    //filter out null, and all tags beginning with *
    categories = _.filter(categories, tag => tag!="null" && !tag.startsWith("*"))
    //console.log("********** categories ", categories)
    return (
        <main>
            <PageHeader title={title} backgroundImage={'https://source.unsplash.com/1600x900/?abstract.'+ articleid} />
            <article
                className="SinglePost section light"
                itemScope
                itemType="http://schema.org/BlogPosting"
            >
                <div className="container skinny">
                    <Link className="SinglePost--BackButton" to="/news/">
                        <ChevronLeft /> BACK
                    </Link>
                    <div className="SinglePost--Content relative">
                        <div className="SinglePost--Meta">
                            Posted: {dateadded} <br/>

                        </div>

                        {title && (
                            <h1 className="SinglePost--Title" itemProp="title">
                                {title}
                            </h1>
                        )}

                        {image && (
                            <div className="SinglePost--InnerContent">
                                <img src={image} title={title} width="100%"/>
                            </div>
                        )}

                        <div className="SinglePost--InnerContent">
                            <Content source={comment} />
                        </div>

                        <div className="SinglePost--InnerContent">
                            {author && source &&
                                <div>From {author} at {source}</div>
                            }
                            {publishdate &&
                                <div>Originally published {publishdate}</div>
                            }
                        </div>

                        <div className="SinglePost--InnerContent">
                            <blockquote>{highlight}</blockquote>
                        </div>

                        <div className="SinglePost--InnerContent">
                            <blockquote>{highlight2}</blockquote>
                        </div>

                        <div className="SinglePost--Pagination">
                            <a href={url} target="_blank" className="Nav--CTA animated jello fadeInDown delay-2s">Read the original post &gt;</a>
                        </div>
                        <br/>
                        {categories && categories.length > 0 && (
                            <Fragment>
                              <i>Tags:
                                {categories.map((cat, index) => (
                                    <span
                                        key={cat}
                                        className="SinglePost--Meta--Category"
                                    >
                                        <a href={`/news/?tag=${cat.trim()}`}>
                                          {cat.trim()}
                                        </a>
                                        {/* Add a comma on all but last category */}
                                        {index !== categories.length - 1 ? ',' : ''}
                                    </span>
                                ))}</i>
                            </Fragment>
                        )}
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
const NewsPost = ({ data: { news, allNews } }) => {
    console.log("**********")
    console.log(news)
    const relatedNews = getRelatedNews(news, allNews.edges);
    console.log("++++++ relatedNews ",relatedNews)

    return (
        <Layout
            description={news.highlight || false}
            title={news.title || false}
        >
            <NewsPostTemplate
                {...news}
                body={news.text}
                nextPostURL={_.get(news, 'next.id')}
                prevPostURL={_.get(news, 'previous.id')}
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
    news: googleSheetListRow(id: { eq: $id }) {
      articleid
      author
      comment
      dateadded
      excerpt
      extractedkeywords
      headerimage
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
    
    allNews : allGoogleSheetListRow (sort: {fields: dateadded, order: DESC}) {
      edges {
        node {
          articleid
          author
          comment
          dateadded
          excerpt
          extractedkeywords
          headerimage
          highlight
          highlight2
          images
          image
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
    }
  }
`
