const Mutation = {
    createUser(parent, args,{ db },info){
        // console.log(args);
        const emailTaken = db.users.some(user => user.email === args.data.email)

        if(emailTaken){
            throw new Error('Email is already taken');
        }

        const user = {
            id: uuidv4(),
            ...args.data
        }

        db.users.push(user);

        return user;
    },

    createPost(parent, args,{ db },info){
        const userExist = db.users.some(user => user.id === args.data.author);

        if(!userExist){
            throw new Error('User not found');
        }

        const post = {
            id:  uuidv4(),
            ...args.data
        }

        db.posts.push(post);

        return post;
    },

    createComment(parent, args,{ db },info){
        const userExists = db.users.some(user => user.id === args.data.author);
        const postExists = db.posts.some(post => post.id === args.data.post && post.published);

        if(!userExists || !postExists){
            throw new Error('Unable to find user and post');
        }

        const comment = {
            id: uuidv4(),
            ...args.data
        }

        db.comments.push(comment);

        return comment
    },

    deleteUser(parent,args,{ db },info){
        const userIndex = db.users.findIndex(user => user.id === args.id);

        if(userIndex === -1){
            throw new Error('User not found');
        }

        const deletedUsers = db.users.splice(userIndex,1);

        db.posts = db.posts.filter(post => {
            const match = post.author === args.id

            if(match){
                db.comments = db.comments.filter(comment => comment.post !== post.id)
            }

            return !match;
        });

        db.comments = comment.filter(comment => comment.author !== args.id)

        return deletedUsers[0];

    },

    deletePost(parent, args,{db},info){
        const postIndex = db.posts.findIndex(post => post.id === args.id);

        if(postIndex === -1) {
            throw new Error('Post not found');
        }

        const deletedPosts = db.posts.splice(postIndex, 1);

        db.comments = db.comments.filter(comment => comment.post !== args.id);

        return deletedPosts[0];
    },

    deleteComment(parent, args,{db},info){
        const commentIndex = db.comments.findIndex(comment => comment.id === args.id);

        if(postIndex === -1) {
            throw new Error('Comment not found');
        }

        const deletedComments = db.comments.splice(commentIndex, 1);

        return deletedComments[0];
    },

    updateUser(parent,args,{ db },info){
        const { id, data } = args;
        const user = db.users.find(user => user.id === id);

        if(!user){
            throw new Error('User not found');
        }

        if(typeof data.email === 'string'){
            const emailTaken = db.users.some(user => user.email === data.email);

            if(emailTaken){
                throw new Email('Email already exists');
            }

            user.email = data.email
        }

        if(typeof data.name === 'string'){
            user.name = data.name;
        }

        if(typeof data.age !== undefined){
            user.age = data.age
        }

        return user;

    },

    updatePost(parent,args,{ db },info){
        const { id, data } = args
        const post = db.posts.find(post => post.id === id);

        if(!post){
            throw new Error('Post not found');
        }

        if(typeof data.title === 'string'){
            post.title = data.title;
        }
        if(typeof data.body === 'string'){
            post.body = data.body;
        }
        if(typeof data.published === 'boolean'){
            post.published = data.published;
        }

        return post;
    },

    updateComment(parent,args,{ db },info){
        const { id, data } = args;
        const comment = db.comments.find(comment => comment.id === id);

        if(!comment){
            throw new Error('Comment not found');
        }

        if(typeof data.text === 'string'){
            comment.text = data.text
        }

        return comment;
    }
}

export { Mutation as default }