import type { Request, Response } from "express";
export declare class CatalogosController {
    static getLugares(req: Request, res: Response): Promise<void>;
    static getActividades(req: Request, res: Response): Promise<void>;
    static getDificultades(req: Request, res: Response): Promise<void>;
    static getAll(req: Request, res: Response): Promise<void>;
    static createLugar(req: Request, res: Response): Promise<void>;
    static createActividad(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=catalogos.controller.d.ts.map