import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/Layout'
import PageHeader from '../components/PageHeader'
import ProductGrid from '../components/ProductGrid'

const ServicesPage = ({ data: { page } }) => {
    
    return (
        <Layout
            meta={page.frontmatter.meta || false}
            title={page.frontmatter.title || false}
        >
            <PageHeader
                title={page.frontmatter.title || false}
                subtitle={page.frontmatter.subtitle || false}
                backgroundImage={page.frontmatter.featuredImage || false}
            />
            <section className="section">
                <div className="container">
                    <ProductGrid />
                </div>
            </section>

        </Layout>
    );
}
export default ServicesPage

export const pageQuery = graphql`
  query ServiceIndex {
    page: markdownRemark(frontmatter: {slug: {eq: "services"}}) {
      ...Meta
      frontmatter {
        title
        excerpt
        subtitle
        featuredImage
      }
    }
}
`
