function AppPosts({posts, Callback}) {
        return ( 
        <div className = "wrapper row" >
            {posts.map(post => (
                < Callback
                key = {post._id}
                post = {post}
                />
        ))}
             </div>
    )
}