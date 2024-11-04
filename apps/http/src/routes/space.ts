import { Router } from "express";
import client from "@repo/db/src/db";

export const spaceRouter = Router();

spaceRouter.get("/:spaceId", async (req: any, res: any) => {
  const spaceId = req.query.spaceId as string;

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

spaceRouter.delete("/:spaceId", async (req: any, res: any) => {
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
