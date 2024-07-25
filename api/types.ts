import { Request } from "express";

interface User {
  id: string;
  // other properties of the user object if needed
}

export interface CustomRequest extends Request {
  user: any;
}
