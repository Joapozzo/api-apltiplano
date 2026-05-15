import type { Request, Response } from "express";
export declare class ExpedicionesController {
    static getAll(req: Request, res: Response): Promise<void>;
    static getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getActive(req: Request, res: Response): Promise<void>;
    static create(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static delete(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static changeEstado(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static recalcularCupos(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=expediciones.controller.d.ts.map