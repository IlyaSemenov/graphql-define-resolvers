import { defineMutation } from ".."

export default defineMutation("login", ({ args }) => {
  return { id: 1, name: args.username }
})
