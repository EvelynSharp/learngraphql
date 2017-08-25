const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} = graphql;

const users = [
  { id: '23', firstName: 'Bill', age: 20},
  { id: '47', firstName: 'Samantha', age: 21}
]

//instruct graphyql existence of a user
//name(string, cap 1st letter) and fields(tell gql diff properties a User has) are required properties
//tell graphql structure, and properties
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString},
    firstName: { type: GraphQLString},
    age: { type: GraphQLInt}
  }
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString }}, //args is short for arugments
      resolve(parentValue, args) {
        //the actual action of go grab the data based on args provided ; parentValue almost never used

      }
    }
  }
});
