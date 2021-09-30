function PostItem({key,post}) {
    console.log(post);
    if (post) {
        return (
        <div className="new-item card card-full text-white overflow col-lg-3 col-md-4 col-sm-6 col-12">
            <div className="height-ratio image-wrapper" >
                <a href={post.slug}>
                    <img src={post.avatarUrl} className="img-fluid lazy wp-post-image loaded"/>
                </a> 
            </div>
            <div className="position-absolute px-3 pb-3 pt-0 b-0 w-100 bg-shadow" >
                <a href="/posts/notofi" className="p-1 badge bg-primary text-white" >
                    Post 
                </a> 
                <h3 className="h5 h3-sm h5-md text-light my-1" >
                    < a href={post.slug} className="text-white" > {post.description} </a>
                </h3>
            </div>
        </div>
         )
    }
}