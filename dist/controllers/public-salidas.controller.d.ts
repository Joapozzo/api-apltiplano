import type { Request, Response } from "express";
export declare class PublicSalidasController {
    static list(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static calendario(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getByIdentificador(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=public-salidas.controller.d.ts.map