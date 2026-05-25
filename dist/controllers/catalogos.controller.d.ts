import type { Request, Response } from "express";
export declare class CatalogosController {
    static getAll(_req: Request, res: Response): Promise<void>;
    static getUbicaciones(req: Request, res: Response): Promise<void>;
    static getUbicacionById(req: Request, res: Response): Promise<void>;
    static createUbicacion(req: Request, res: Response): Promise<void>;
    static updateUbicacion(req: Request, res: Response): Promise<void>;
    static toggleUbicacionActivo(req: Request, res: Response): Promise<void>;
    static deleteUbicacion(req: Request, res: Response): Promise<void>;
    static getLugares(req: Request, res: Response): Promise<void>;
    static getLugarById(req: Request, res: Response): Promise<void>;
    static createLugar(req: Request, res: Response): Promise<void>;
    static updateLugar(req: Request, res: Response): Promise<void>;
    static toggleLugarActivo(req: Request, res: Response): Promise<void>;
    static deleteLugar(req: Request, res: Response): Promise<void>;
    static getActividades(req: Request, res: Response): Promise<void>;
    static getActividadById(req: Request, res: Response): Promise<void>;
    static createActividad(req: Request, res: Response): Promise<void>;
    static updateActividad(req: Request, res: Response): Promise<void>;
    static toggleActividadActivo(req: Request, res: Response): Promise<void>;
    static deleteActividad(req: Request, res: Response): Promise<void>;
    static getDificultades(req: Request, res: Response): Promise<void>;
    static getDificultadById(req: Request, res: Response): Promise<void>;
    static createDificultad(req: Request, res: Response): Promise<void>;
    static updateDificultad(req: Request, res: Response): Promise<void>;
    static toggleDificultadActivo(req: Request, res: Response): Promise<void>;
    static deleteDificultad(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=catalogos.controller.d.ts.map