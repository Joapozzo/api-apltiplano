import type { Request, Response } from "express";
export declare class DashboardController {
    static getResumen(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getActividad(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAlertas(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=dashboard.controller.d.ts.map