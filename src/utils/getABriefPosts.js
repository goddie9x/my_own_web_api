module.exports = function getABriefPosts(Posts) {
    let briefPosts = Posts.map((post) => {
        let { authorId, content, createdAt, _id, ...briefPost } = post;
        return briefPost;
    });

    return briefPosts;
}