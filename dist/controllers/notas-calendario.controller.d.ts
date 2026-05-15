import type { Request, Response } from "express";
export declare class NotasCalendarioController {
    static getNotas(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getNotasByMes(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getNotaById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static createNota(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateNota(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static toggleCompletada(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static deleteNota(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=notas-calendario.controller.d.ts.map