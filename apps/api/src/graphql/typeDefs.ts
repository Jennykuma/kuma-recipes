export const typeDefs = `#graphql
  type Tag {
    id: ID!
    name: String!
    slug: String!
  }

  input CreateTagInput {
    name: String!
  }

  type Query {
    tags: [Tag!]!
  }

  type Mutation {
    createTag(input: CreateTagInput!): Tag!
  }
`;
