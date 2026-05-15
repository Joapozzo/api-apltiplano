import type { Request, Response } from "express";
export declare class CoordinadoresController {
    static list(req: Request, res: Response): Promise<void>;
    static getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static create(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static delete(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static asignarAExpedicion(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static desasignarDeExpedicion(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getHistorial(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=coordinadores.controller.d.ts.map