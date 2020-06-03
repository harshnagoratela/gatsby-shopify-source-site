const _ = require('lodash')
const path = require('path')
const urlExists = require("url-exists");
const { createFilePath, createRemoteFileNode } = require('gatsby-source-filesystem')
const { fmImagesToRelative } = require('gatsby-remark-relative-images')

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  createTypes(`
    type MarkdownRemark implements Node {
      localFeaturedImage: File @link(from: "localFeaturedImage___NODE")
    }
  `)
}

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            frontmatter {
              template
              title
            }
            fields {
              slug
              contentType
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const mdFiles = result.data.allMarkdownRemark.edges

    const contentTypes = _.groupBy(mdFiles, 'node.fields.contentType')

    _.each(contentTypes, (pages, contentType) => {
      const pagesToCreate = pages.filter(page =>
        // get pages with template field
        _.get(page, `node.frontmatter.template`)
      )
      if (!pagesToCreate.length) return console.log(`Skipping ${contentType}`)

      console.log(`Creating ${pagesToCreate.length} ${contentType}`)

      pagesToCreate.forEach((page, index) => {
        const id = page.node.id
        createPage({
          // page slug set in md frontmatter
          path: page.node.fields.slug,
          component: path.resolve(
            `src/templates/${String(page.node.frontmatter.template)}.js`
          ),
          // additional data can be passed via context
          context: {
            id
          }
        })
      })
    })

    //Creating Shopify Product Pages
    return graphql(`
      {
        allShopifyProduct {
          edges {
            node {
              handle
            }
          }
        }
      }
    `).then(result => {
        result.data.allShopifyProduct.edges.forEach(({ node }) => {
        createPage({
            path: `/solution/${node.handle}/`,
            component: path.resolve(`./src/templates/ProductPage.js`),
            context: {
            // Data passed to context is available
            // in page queries as GraphQL variables.
            handle: node.handle,
            },
        })
        })
    })

  })
}

exports.onCreateNode = ({ node, store, cache, actions, createNodeId, getNode }) => {
  const { createNodeField, createNode } = actions

  // convert frontmatter images
  fmImagesToRelative(node)

  // Create smart slugs
  // https://github.com/Vagr9K/gatsby-advanced-starter/blob/master/gatsby-node.js
  let slug
  if (node.internal.type === 'MarkdownRemark') {
    const fileNode = getNode(node.parent)
    const parsedFilePath = path.parse(fileNode.relativePath)

    if (_.get(node, 'frontmatter.slug')) {
      slug = `/${node.frontmatter.slug.toLowerCase()}/`
    } else if (
      // home page gets root slug
      parsedFilePath.name === 'home' &&
      parsedFilePath.dir === 'pages'
    ) {
      slug = `/`
    } else if (_.get(node, 'frontmatter.title')) {
      slug = `/${_.kebabCase(parsedFilePath.dir)}/${_.kebabCase(
        node.frontmatter.title
      )}/`
    } else if (parsedFilePath.dir === '') {
      slug = `/${parsedFilePath.name}/`
    } else {
      slug = `/${parsedFilePath.dir}/`
    }

    const featuredImage = node.frontmatter.featuredImage;
    if(featuredImage && featuredImage.startsWith("http") && featuredImage != "https://ucarecdn.com/3ce1b407-7d43-413f-a45a-c0699ede8f8b/") {
        //these are the cases to handle
        console.log("********* "+slug+" = "+featuredImage)
    }

    createNodeField({
      node,
      name: 'slug',
      value: slug
    })

    // Add contentType to node.fields
    createNodeField({
      node,
      name: 'contentType',
      value: parsedFilePath.dir
    })
  }
}

function doURLPing(url) {
    urlExists(url, function(err, exists) {
        //console.log("+++++++++ URL = '"+url+"' = "+exists);
        if(!exists) {
            console.warn("---- WARNING: Ignoring URL '"+url+"' as it is not reachable");
        }
        return exists;
    });
}

// Random fix for https://github.com/gatsbyjs/gatsby/issues/5700
module.exports.resolvableExtensions = () => ['.json']
