import type { Request, Response, NextFunction } from "express";
export interface AuditLogEntry {
    timestamp: string;
    user_id?: number;
    user_email?: string;
    ip_address: string;
    user_agent: string;
    method: string;
    path: string;
    action: string;
    resource_type?: string;
    resource_id?: string;
    status_code: number;
    duration_ms?: number;
}
export declare function auditMiddleware(req: Request, res: Response, next: NextFunction): void;
export declare const audit: typeof auditMiddleware;
//# sourceMappingURL=audit.d.ts.map