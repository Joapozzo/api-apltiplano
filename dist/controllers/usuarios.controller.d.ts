import type { Request, Response } from "express";
export declare class UsuariosController {
    static getAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getMe(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateMe(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateActivo(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateRol(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=usuarios.controller.d.ts.map