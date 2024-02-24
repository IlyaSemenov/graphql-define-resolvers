import { resolvers } from ".."

resolvers.defineMutation("login", ({ args }) => {
  return { id: 1, name: args.username }
})
