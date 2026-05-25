import type { NextFunction, Request, Response } from "express";
export declare class UploadController {
    static subirImagen(req: Request, res: Response, next: NextFunction): Promise<void>;
    static eliminarImagen(req: Request, res: Response, next: NextFunction): Promise<void>;
    static subirFotoCoordinador(req: Request, res: Response, next: NextFunction): Promise<void>;
    static eliminarFotoCoordinador(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getFotoCoordinador(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getImagenesServicio(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=upload.controller.d.ts.map