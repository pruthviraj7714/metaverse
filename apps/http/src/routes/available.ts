import { Router } from "express";
import client from "@repo/db/src/db";
export const availableRouter = Router();

availableRouter.get("/spaces", async (req: any, res: any) => {
  try {
    const spaces = await client.space.findMany({});

    return res.status(200).json({
      spaces,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

availableRouter.get("/maps", async (req: any, res: any) => {
  try {
    const maps = await client.map.findMany({});

    return res.status(200).json({
      maps,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

availableRouter.get("/elements", async (req: any, res: any) => {
  try {
    const elements = await client.element.findMany({});

    return res.status(200).json({
      elements,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

availableRouter.get("/avatars", async (req: any, res: any) => {
  try {
    const avatars = await client.avatar.findMany({});

    return res.status(200).json({
      avatars,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
