import React from 'react'
import { Link } from 'gatsby'

import Image from './Image'
import './PostCard.css'

const PostCard = ({
  featuredImage,
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
    <div className="PostCard--Image relative">
        {featuredImage && typeof featuredImage === 'object' &&
            <Image background src={featuredImage && featuredImage.childImageSharp && featuredImage.childImageSharp.fluid.src} alt={title} />
        }
        {featuredImage && typeof featuredImage === 'string' &&
            <Image background src={featuredImage} alt={title} />
        }
    </div>
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
