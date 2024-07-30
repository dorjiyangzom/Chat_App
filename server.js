import { ApolloServer,gql} from 'apollo-server-express';
import typeDefs from './typeDefs.js';
import resolvers from './resolvers.js';
import jwt from 'jsonwebtoken'
import { WebSocketServer } from 'ws';
import express from 'express'
import {useServer } from 'graphql-ws/lib/use/ws'
import { makeExecutableSchema} from '@graphql-tools/schema'
const app = express();

const context = ({req})=>{
            const {authorization} = req.headers
            if(authorization){
                const {userId} = jwt.verify(authorization, process.env.JWT_SECRET)
                return {userId}
            }
}

const schema = makeExecutableSchema({typeDefs,resolvers})

const apolloServer = new ApolloServer({ schema,context });

await apolloServer.start()
apolloServer.applyMiddleware({ app, path:"/graphql" });

const server = app.listen(4000, () => {
    const webServer = new WebSocketServer({
        server,
        path:"/graphql",
    });
    useServer({ schema }, webServer);
    console.log("apollo and subscription is up")
})
// const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     context:({req})=>{
//         const {authorization} = req.headers
//         if(authorization){
//             const {userId} = jwt.verify(authorization, process.env.JWT_SECRET)
//             return {userId}
//         }
//     }
//   });

//   server.listen().then(({ url }) => {
//     console.log(`🚀 Server ready at ${url}`);
//   });