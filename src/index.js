import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4} from 'uuid';

//dummy data
let users = [
    {
        id: '1',
        name: 'Potato',
        email: 'ishiyaki@mail.com',
        age: 25
    },
    {
        id: '2',
        name: 'Avi',
        email: 'shotgun@mail.com',
        age: 23
    }
];

let posts = [
    {
        id: '10',
        title: 'GraphQL Basics',
        body: 'this is basic stuff',
        published: true,
        author: '1'
    },
    {
        id: '11',
        title: 'Advanced GraphQL',
        body: 'this is advanced stuff',
        published: true,
        author: '1'
    },
    {
        id: '12',
        title: 'Master GraphQL',
        body: 'this is way too advanced',
        published: false,
        author: '2'
    }
];

let comments = [
    {
        id: '1',
        text: 'Yummy',
        author: '1',
        post: '10'
    },
    {
        id: '2',
        text: 'Sweet',
        author: '1',
        post: '11'
    }
]

//Type definitions
//5 main scalar types -- String, Int, Boolean, Float, ID
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
    }

    type Mutation {
        createUser(data: CreateUserInput) : User!
        createPost(data: CreatePostInput) : Post!
        createComment(data: CreateCommentInput) : Comment!
        deleteUser(id: ID!): User!
        deletePost(id: ID!): Post!
        deleteComment(id: ID!): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput{
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput{
        text: String!
        author: ID!
        post: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }


`

//Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info){
            // return users
            if(!args.query){
                return users;
            }

            return users.filter((user)=> {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            });
        },
        posts(parent, args,ctx,info){
            // return posts
            if(!args.query){
                return posts;
            }

            return posts.filter((post)=>{
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
                return isBodyMatch || isTitleMatch;
            });
        },
        comments(parent, args,ctx,info){
            if(!args.query){
                return comments;
            }

            return comments.filter((comment)=>{
                return comment.text.toLowerCase().includes(args.query.toLowerCase());
            });
        }
    },
    Mutation: {
        createUser(parent, args,ctx,info){
            // console.log(args);
            const emailTaken = users.some(user => user.email === args.data.email)

            if(emailTaken){
                throw new Error('Email is already taken');
            }

            const user = {
                id: uuidv4(),
                ...args.data
            }

            users.push(user);

            return user;
        },

        createPost(parent, args,ctx,info){
            const userExist = users.some(user => user.id === args.data.author);

            if(!userExist){
                throw new Error('User not found');
            }

            const post = {
                id:  uuidv4(),
                ...args.data
            }

            posts.push(post);

            return post;
        },

        createComment(parent, args,ctx,info){
            const userExists = users.some(user => user.id === args.data.author);
            const postExists = posts.some(post => post.id === args.data.post && post.published);

            if(!userExists || !postExists){
                throw new Error('Unable to find user and post');
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            }

            comments.push(comment);

            return comment
        },

        deleteUser(parent,args,ctx,info){
            const userIndex = users.findIndex(user => user.id === args.id);

            if(userIndex === -1){
                throw new Error('User not found');
            }

            const deletedUsers = users.splice(userIndex,1);

            posts = posts.filter(post => {
                const match = post.author === args.id

                if(match){
                    comments = comments.filter(comment => comment.post !== post.id)
                }

                return !match;
            });

            comments = comment.filter(comment => comment.author !== args.id)

            return deletedUsers[0];

        }
    },
    Post: {
        author(parent, args, ctx, info){
            return users.find((user) => {
                return user.id === parent.author
            })
        },

        comments(parent,args,ctx,info){
            return comments.filter(comment => comment.post === parent.id);
        }
    },
    User: {
        posts(parent, args, ctx, info){
            return posts.filter(post => {
                return post.author === parent.id
            });
        },

        comments(parent,args,ctx,info){
            return comments.filter(comment => comment.author === parent.id)
        }
    },
    Comment: {
        author(parent, args,ctx,info){
            return users.find(user => user.id === parent.author);
        },

        post(parent, args,ctx,info){
            return posts.find(post => post.id === parent.post);
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

// runs on port 4000
server.start(() => {
    console.log('Server is running......');
})

