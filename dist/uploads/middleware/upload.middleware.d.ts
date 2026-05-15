import type { NextFunction, Request, Response } from "express";
export declare function procesarImagen(buffer: Buffer, mimetype: string): Promise<Buffer>;
export declare function uploadMiddleware(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=upload.middleware.d.ts.map