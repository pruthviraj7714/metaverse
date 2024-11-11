import z from "zod"


export const SignUpSchema = z.object({
    username : z.string(),
    password : z.string(),
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

export const CreateMapSchema = z.object({
    name : z.string(),
    description : z.string(),
    dimensions : z.object({
        height : z.number(),
        width : z.number()
    }),
    backgroundBaseUrl : z.string(),
});

export const CreateAvatarSchema = z.object({
    name: z.string(),
    imageUrl : z.string(),
});

export const createSpaceSchema = z.object({
    mapId : z.string(),
    name : z.string()
})