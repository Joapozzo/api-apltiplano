import type { NextFunction, Request, Response } from "express";
type ProcesarImagenOptions = {
    maxWidth?: number;
    quality?: number;
};
export declare function procesarImagen(buffer: Buffer, mimetype: string, options?: ProcesarImagenOptions): Promise<Buffer>;
export declare function procesarImagenAvatar(buffer: Buffer, mimetype: string): Promise<Buffer>;
export declare const uploadMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export declare const uploadAvatarMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=upload.middleware.d.ts.map