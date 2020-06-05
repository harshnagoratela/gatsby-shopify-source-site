import React from 'react'
import { Link } from 'gatsby'
import GatsbyImage from 'gatsby-image'
import Image from './Image'
import './PostCard.css'

const PostCard = ({
  featuredImage,
  featuredImageLocal,
  title,
  excerpt,
  date,
  client,
  slug,
  categories = [],
  className = '',
  ...props
}) => (
  <Link to={slug} className={`PostCard ${className}`}>
    {featuredImage && (
      <div className="PostCard--Image relative">
        <Image background src={featuredImage} alt={title} />
      </div>
    )}
    {!featuredImage && featuredImageLocal && (
      <div className="PostCard--Image relative">
        <GatsbyImage fluid={featuredImageLocal.childImageSharp.fluid} alt={title} />
      </div>
    )}
    <div className="PostCard--Content">
      {title && <h3 className="PostCard--Title">{title}</h3>}
      <div className="PostCard--Category">
      {date} <br/>


      </div>
      <div className="PostCard--Date">

      </div>
      {excerpt && <div className="PostCard--Excerpt">{excerpt}</div>}
    </div>
  </Link>
)

export default PostCard
