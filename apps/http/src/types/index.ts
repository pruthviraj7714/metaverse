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

export const CreateElementSchema = z.object({
    name : z.string(),
    dimensions : z.object({
        height : z.number(),
        width : z.number()
    }),
    position : z.object({
        xcoor : z.number(),
        ycoor : z.number()
    }),
    imageUrl : z.string(),
    mapId : z.string(),

})
