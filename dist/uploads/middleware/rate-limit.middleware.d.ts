import type { NextFunction, Request, Response } from "express";
export declare function refreshUploadLimit(): Promise<void>;
export declare function getRateLimitInfo(id_usuario: number): Promise<{
    max_por_mes: number;
    usadas: number;
    restantes: number;
    resetTime: Date;
}>;
export declare function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): void;
export declare function deleteRateLimitMiddleware(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=rate-limit.middleware.d.ts.map