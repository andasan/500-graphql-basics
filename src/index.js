import { GraphQLServer } from 'graphql-yoga';

//dummy data
const users = [
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

const posts = [
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
]

//Type definitions
//5 main scalar types -- String, Int, Boolean, Float, ID
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
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
        post() {
            return {
                id: '1223',
                title: 'Panda Post',
                body: 'Chubby Panda',
                published: true
            }
        }
    },
    Post: {
        author(parent, args, ctx, info){
            return users.find((user) => {
                return user.id === parent.author
            })
        }
    },
    User: {
        posts(parent, args, ctx, info){
            return posts.filter(post => {
                return post.author === parent.id
            });
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

