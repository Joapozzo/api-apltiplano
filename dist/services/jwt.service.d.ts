export interface TokenPayload {
    id_expedicion: number;
    id_cliente: number;
    expires_at: string;
}
export declare class JWTService {
    private static readonly SECRET;
    private static readonly ALGORITHM;
    static generateToken(id_expedicion: number, id_cliente: number, expiresInDays?: number): string;
    static verifyToken(token: string): TokenPayload | null;
}
//# sourceMappingURL=jwt.service.d.ts.map