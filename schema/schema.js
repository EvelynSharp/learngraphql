const graphql = require('graphql');
const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema //takes a rootquery and returns a graphql schema instance

} = graphql;
const baseUrl = 'http://localhost:3000'
// const users = [
//   { id: '23', firstName: 'Bill', age: 20},
//   { id: '47', firstName: 'Samantha', age: 21}
// ]

//must be before UserType - to use as a newly defined type for a field in User
//associate it with a user - treat associations between types as though it's just another field
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ( {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then( res => res.data)
      }
    }
  })
});


//instruct graphyql existence of a user
//name(string, cap 1st letter) and fields(tell gql diff properties a User has) are required properties
//tell graphql structure, and properties
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then( res => res.data)
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString }}, //args is short for arugments
      resolve(parentValue, args) {
        //the actual action of go grab the data based on args provided ; parentValue almost never used
        // return _.find(users, { id: args.id });
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(res => res.data );
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString }},
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(res => res.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType, //define what comes back from the resolve func, might change after operation
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) }, //required field or error
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString}
      },
      resolve(parentValue, { firstName, age }) {
        return axios.post(`${baseUrl}/users`, { firstName, age })
          .then( res => res.data )
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, {id}) {
        return axios.delete(`${baseUrl}/users/${id}`)
          .then( res => res.data )
      }
    }
  }
});


//merge the types together into a graphql schema obj
//hand it back to the graphql middlewate in server.js

module.exports = new GraphQLSchema ({
  query: RootQuery,
  mutation,
})
