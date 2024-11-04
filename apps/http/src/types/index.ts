import z from "zod"


export const SignUpSchema = z.object({
    username : z.string(),
    password : z.string(),
    role : z.enum(["Admin", "User"])
})

export const SignInSchema = z.object({
    username : z.string(),
    password : z.string()
})

