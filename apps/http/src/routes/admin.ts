import { Router } from "express";
import { adminMiddleware } from "../middleware/middleware";
import {
  CreateAvatarSchema,
  CreateElementSchema,
  CreateMapSchema,
} from "../types";
import client from "@repo/db/client";

export const adminRouter = Router();

adminRouter.post("/add-map", adminMiddleware, async (req: any, res: any) => {
  try {
    const parsedBody = CreateMapSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(404).json({
        message: "Invalid Inputs",
        error: parsedBody.error.format(),
      });
    }

    const { name, description, backgroundBaseUrl, dimensions } =
      parsedBody.data;

    const createdMap = await client.map.create({
      data: {
        name,
        description,
        backgroundBaseUrl,
        dimensions,
      },
    });

    return res.status(201).json({
      message: "Map created successfully",
      mapId: createdMap.id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
});

adminRouter.post(
  "/add-element",
  adminMiddleware,
  async (req: any, res: any) => {
    try {
      const parsedBody = CreateElementSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({
          message: "Invalid Inputs",
          errors: parsedBody.error.format(),
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
        },
      });

      return res.status(201).json({
        message: "Element created successfully",
        elementId: element.id,
      });
    } catch (error) {
      console.error("Error creating element:", error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
);

adminRouter.post("/add-avatar", adminMiddleware, async (req: any, res: any) => {
  const parsedBody = CreateAvatarSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      message: "Invalid Inputs",
      errors: parsedBody.error.format(),
    });
  }

  const { imageUrl } = parsedBody.data;
  try {
    const avatar = await client.avatar.create({
      data: {
        imageUrl,
      },
    });

    return res.status(201).json({
      message: "Avatar created successfully",
      avatarId: avatar.id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
