import { resolvers } from ".."

resolvers.defineQuery("whoami", ({ context }) => {
  return context.userId ? { id: context.userId, name: "test" } : null
})
