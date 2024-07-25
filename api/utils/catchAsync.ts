// utils/catchAsync.ts

import { Request, Response, NextFunction } from "express";

export const catchAsync = <Req extends Request>(
  fn: (req: Req, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req as Req, res, next).catch(next);
  };
};
