import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4} from 'uuid';

import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'

const server = new GraphQLServer({
    typeDefs: `./src/schema.graphql`,
    resolvers: {
        Query,
        Mutation,
        User,
        Post,
        Comment
    },
    context: {
        db
    }
});

// runs on port 4000
server.start(() => {
    console.log('Server is running......');
})

