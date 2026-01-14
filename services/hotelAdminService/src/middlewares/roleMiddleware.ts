import { Request, Response, NextFunction } from "express";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as any;

  const groups: string[] = user?.["cognito:groups"] || [];

  if (!groups.includes("ADMIN")) {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};
