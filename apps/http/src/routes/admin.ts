import { Router } from "express";
import authMiddleware from "../middleware/middleware";
import { CreateElementSchema } from "../types";
import client from "@repo/db/src/db"

export const adminRouter = Router();

adminRouter.post('/add-element', authMiddleware, async (req : any, res : any) => {
    try {
        const userId = req.userId;

        const parsedBody = CreateElementSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({
                message: "Invalid Inputs",
                errors: parsedBody.error.format()
            });
        }

        const { name, position, dimensions, imageUrl, mapId } = parsedBody.data;

        const element = await client.element.create({
            data: {
                dimensions,
                imageUrl,
                name,
                position,
                mapId,
            }
        });

        return res.status(201).json({
            message: "Element created successfully",
            elementId: element.id
        });

    } catch (error) {
        console.error("Error creating element:", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
