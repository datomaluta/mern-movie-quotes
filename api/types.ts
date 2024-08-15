import { Request } from "express";

interface User {
  id: string;
}

export interface CustomRequest extends Request {
  user: any;
}
