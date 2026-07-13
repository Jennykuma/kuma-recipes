export const typeDefs = `#graphql
  type RecipeListItem {
    id: ID!
    rating: Int!
    title: String!
    tags: [Tag!]
    imagePath: String
  }

  type Recipe {
    id: ID!
    ingredients: [String!]!
    notes: String!
    rating: Int!
    steps: [String!]!
    tags: [Tag!]!
    title: String!
    source: String!
    imagePath: String
    yield: String
    createdAt: String!
    updatedAt: String!
  }

  type Tag {
    id: ID!
    name: String!
    slug: String!
  }

  input CreateTagInput {
    name: String!
  }

  input CreateRecipeInput {
    title: String!
    ingredients: [String!]
    notes: String
    rating: Int
    steps: [String!]
    tagIds: [String!]
    source: String
    imagePath: String
    yield: String
  }

  type Query {
    tags: [Tag!]!
    recipes(tag: [String!]): [RecipeListItem!]!
    recipe(id: ID!): Recipe
  }

  type Mutation {
    createTag(input: CreateTagInput!): Tag!
    createRecipe(input: CreateRecipeInput!): Recipe!
  }
`;
