const express = require('express');
//express is an http server
//exam if req want to deal with graphQL, if so, hand over to graphQL
//graphyQL is just a small part of what express app handles
const expressGraphQL = require('express-graphql');
//compatability layer between express and graphyQL
//must be GraphQL


const app = express();

//the only time use graphql instead of GraphQL
//this tells express send all req to gql if using route '/graphql'
app.use('/graphql', expressGraphQL({
  graphiql: true
}))
//graphiql is a tool allow making req to development server
//only intended for dev environment

//app.use is how we wire up middleware to express application
//middlewares are tiny func that's mean to intercept or modify req coming through to express server
//expressGraphQL is registered as a middleware

//schema file - tell graphql how the data in our app is arranged or how it can be accessed 


app.listen(4000, () => {
  console.log('Listening');
});
