import { Router } from "express";
import client from "@repo/db/client";
import authMiddleware from "../middleware/middleware";
import { createSpaceSchema } from "../types";

export const spaceRouter = Router();

spaceRouter.post("/create", authMiddleware, async (req: any, res: any) => {
  const parsedBody = createSpaceSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      message: "Inavlid Inputs",
      error: parsedBody.error.format(),
    });
  }

  try {
    const { mapId, name } = parsedBody.data;
    await client.space.create({
      data: {
        name,
        creatorId : req.userId,
        mapId,
      },
    });

    return res.status(201).json({
      message: "Space Successfully Created",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

spaceRouter.get("/all", authMiddleware, async (req: any, res: any) => {
  const userId = req.userId;

  try {
    const spaces = await client.space.findMany({
      where: {
        creatorId: userId,
      },
      include: {
        map: true,
      },
    });

    return res.json({
      spaces,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

spaceRouter.get("/:spaceId", authMiddleware, async (req: any, res: any) => {
  const spaceId = req.params.spaceId as string;

  if (!spaceId) {
    return res.status(400).json({
      message: "No SpaceId found",
    });
  }

  try {
    const space = await client.space.findFirst({
      where: {
        id: spaceId,
      },
      include : {
        map : true
      }
    });

    if (!space) {
      return res.status(404).json({
        message: "Space not found",
      });
    }

    return res.status(200).json(space);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

spaceRouter.delete("/:spaceId", authMiddleware, async (req: any, res: any) => {
  const spaceId = req.query.spaceId as string;

  if (!spaceId) {
    return res.status(400).json({
      message: "Space Id not found!",
    });
  }

  try {
    const space = await client.space.findFirst({
      where: {
        id: spaceId,
      },
    });

    if (!space) {
      return res.status(404).json({
        message: "Space not found",
      });
    }

    await client.space.delete({
      where: {
        id: space.id,
      },
    });

    return res.status(200).json({
      message: "Space Successfully Deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
