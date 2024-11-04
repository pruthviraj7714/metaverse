import { Router } from "express";
import authMiddleware from "../middleware/middleware";

export const adminRouter = Router();

adminRouter.get('/', authMiddleware , async (req, res) => {
    
})