import bcrypt from "bcryptjs"
import { Router } from "express";
import client from "@repo/db/client";
import { SignInSchema, SignUpSchema } from "../types";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";
import authMiddleware from "../middleware/middleware";
import dotenv from "dotenv";

dotenv.config();

export const userRouter = Router();

userRouter.post("/signup", async (req: any, res: any) => {
  const parsedBody = SignUpSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      message: "Invalid Inputs",
      errors: parsedBody.error.format(),
    });
  }

  const { username, password } = parsedBody.data;

  try {
    const existingUser = await client.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    const isAdmin = username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD
      
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await client.user.create({
      data: {
        username,
        password: hashedPassword,
        role : isAdmin ? "Admin" : "User"
      },
    });

    return res.status(201).json({
      message: "User successfully created!",
      userId: user.id,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

userRouter.post("/signin", async (req: any, res: any) => {
  const parsedBody = SignInSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      message: "Invalid Inputs",
      errors: parsedBody.error.format(),
    });
  }

  const { username, password } = parsedBody.data;

  try {
    const user = await client.user.findFirst({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({
        message: "No User found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);


    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Wrong Password",
      });
    }
    
    const token = jwt.sign(
      { id: user.id, role : user.role },
      JWT_SECRET as string,
    );

    return res.status(200).json({
      message: "Signin successful",
      token,
    });

  } catch (error) {
    console.error("Error during sign-in:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});


userRouter.put('/metadata', authMiddleware, async(req : any, res : any) => { 
  const { avatarId } = req.body;

  if(!avatarId) {
    return res.status(400).json({
      message : "Avatar Id is not found!"
    })
  }
  
  try {
      await client.user.update({
        where : {
          id : req.userId
        },
        data : {
          avatar : avatarId,
        }
      })

      return res.status(200).json({
        message : "Avatar metadata updated successfully!"
      })

  } catch (error) {
    return res.status(500).json({
      message : "Internal Server Error"
    })
  }


})