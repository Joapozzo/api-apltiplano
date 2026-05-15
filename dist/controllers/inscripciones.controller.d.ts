import type { Request, Response } from "express";
export declare class InscripcionesController {
    static generateLink(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static validateToken(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static submit(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static list(req: Request, res: Response): Promise<void>;
    static getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static delete(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static listTokens(req: Request, res: Response): Promise<void>;
    static disableToken(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=inscripciones.controller.d.ts.map