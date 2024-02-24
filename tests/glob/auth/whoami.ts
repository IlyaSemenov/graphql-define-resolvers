import { defineQuery } from ".."

export default defineQuery("whoami", ({ context }) => {
  return context.userId ? { id: context.userId, name: "test" } : null
})
