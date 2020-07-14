const Query = {
    users(parent, args, { db }, info){
        // return users
        if(!args.query){
            return db.users;
        }

        return db.users.filter((user)=> {
            return user.name.toLowerCase().includes(args.query.toLowerCase())
        });
    },
    posts(parent, args,{ db },info){
        // return posts
        if(!args.query){
            return db.posts;
        }

        return db.posts.filter((post)=>{
            const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
            const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
            return isBodyMatch || isTitleMatch;
        });
    },
    comments(parent, args,{ db },info){
        if(!args.query){
            return db.comments;
        }

        return db.comments.filter((comment)=>{
            return comment.text.toLowerCase().includes(args.query.toLowerCase());
        });
    }
}

export { Query as default }