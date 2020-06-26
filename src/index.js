import { GraphQLServer } from 'graphql-yoga';

//Type definitions
//5 main scalar types -- String, Int, Boolean, Float, ID
const typeDefs = `
    type Query {
        greeting(name: String): String!
        add(nums: [Float!]!): Float!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`

//Resolvers
const resolvers = {
    Query: {
        greeting(parent, args, ctx, info) {
            if(args.name){
                return `Hello ${args.name}`
            }
            return 'Hello!'
        },
        add(parent, args, ctx, info) {
            if(args.nums.length === 0){
                return 0;
            }

            return args.nums.reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
            });
        },
        me() {
            return {
                id: 'abc123',
                name: 'Panda',
                email: 'pandasan@gmail.com',
                age: 500
            }
        },
        post() {
            return {
                id: '1223',
                title: 'Panda Post',
                body: 'Chubby Panda',
                published: true
            }
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

