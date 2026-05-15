import type { AuthenticatedRequestUser } from "./auth.types.js";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthenticatedRequestUser;
      fileBuffer?: Buffer;
      fileMimetype?: string;
      cookies?: Record<string, string>;
    }
  }
}

export {};
