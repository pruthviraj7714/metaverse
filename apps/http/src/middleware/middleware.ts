import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "../config/config";

declare module "express-serve-static-core" {
    interface Request {
        userId?: number
    }
}

export default function authMiddleware(req : Request, res : Response, next : NextFunction) {
    const header = req.headers["authorization"];
    const token = header?.split(" ")[1];

    if(!token) {
        return res.status(401).json({
            message : "Token Not found!"
        })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({
            message : "Unauthorized"
        })
    }

}