import type { Request, Response, NextFunction } from "express";
export declare function generateCsrfToken(): string;
export declare function verifyCsrfToken(token: string): boolean;
export declare function csrfMiddleware(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
export declare function csrfProtection(enabled?: boolean): typeof csrfMiddleware;
//# sourceMappingURL=csrf.d.ts.map