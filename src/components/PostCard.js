import React from 'react'
import { Link } from 'gatsby'

import Image from './Image'
import './PostCard.css'

const PostCard = ({
  featuredImage,
  localFeaturedImage,
  title,
  excerpt,
  date,
  client,
  slug,
  categories = [],
  className = '',
  ...props
}) => {

  const postImage = (featuredImage && localFeaturedImage && featuredImage.startsWith('http'))?localFeaturedImage.childImageSharp.fluid.src:featuredImage;
  //console.log("************************")
  //console.log(featuredImage)
  //console.log(postImage)
  //console.log("******************")

  return (
  <Link to={slug} className={`PostCard ${className}`}>
    {postImage && (
      <div className="PostCard--Image relative">
        <Image background src={postImage} alt={title} />
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
)}

export default PostCard
