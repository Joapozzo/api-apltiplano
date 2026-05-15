import type { NextFunction, Request, Response } from "express";
import type { AppRole } from "../types/auth.types.js";
export declare function authorize(...allowedRoles: AppRole[]): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=authorize.d.ts.map