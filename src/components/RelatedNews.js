import React from 'react'
import { includes, orderBy } from 'lodash'

export const getRelatedNews = (currentNews, allNews) => {

    const maxPosts = 3;
    const currentCategories = (currentNews.node.extractedkeywords + "," + currentNews.node.keywords).split(",") || [];
    const currentTags = currentNews.node.tags.split(",") || [];

    console.log("******** in related news")
    console.log(allNews)
    console.log(currentNews)
    console.log(currentCategories)
    console.log(currentTags)

    // Don't include the current post in posts list
    allNews = allNews.filter((post) => post.node.id !== currentNews.node.id);

    const identityMap = {};

    //Map over all posts, add to map and add points
    for (let post of allNews) {

        const id = post.node.id;
        if (!identityMap.hasOwnProperty(id)) {
            identityMap[id] = {
                post: post,
                points: 0
            }
        }

        // For category matches, we add 2 points
        const categoryPoints = 2;
        //if (post.node.frontmatter.categories.category === currentCategories) {
            //identityMap[id].points += categoryPoints;
        //}
        post.node.frontmatter.categories.forEach(({category}) => {
            if (includes(...currentCategories, category)) {
                identityMap[id].points += categoryPoints;
            }
        })

        // For tags matches, we add 1 point
        const tagPoint = 1;
        post.node.frontmatter.tags.forEach((aTag) => {
            if (includes(currentTags, aTag)) {
                identityMap[id].points += tagPoint;
            }
        })

    }

    // Convert the identity map to an array
    const arrayIdentityMap = Object.keys(identityMap).map((id) => identityMap[id]);

    // Use a lodash utility function to sort them 
    // by points, from greatest to least
    const similarPosts = orderBy(
        arrayIdentityMap, ['points'], ['desc']
    )

    console.log("***** relatedNews Output ",similarPosts.splice(0, maxPosts))
    // return the max number posts requested
    return similarPosts.splice(0, maxPosts);

}