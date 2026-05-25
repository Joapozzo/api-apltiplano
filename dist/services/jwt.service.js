import crypto from "crypto";
export class JWTService {
    static SECRET = process.env.JWT_SECRET || "altiplano-secret-key-change-in-production";
    static ALGORITHM = "aes-256-cbc";
    static generateToken(id_expedicion, id_cliente = null, expiresInDays = 7) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresInDays);
        const payload = {
            id_expedicion,
            id_cliente,
            expires_at: expiresAt.toISOString(),
        };
        const payloadString = JSON.stringify(payload);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.ALGORITHM, crypto.scryptSync(this.SECRET, "salt", 32), iv);
        let encrypted = cipher.update(payloadString, "utf8", "hex");
        encrypted += cipher.final("hex");
        return `${iv.toString("hex")}:${encrypted}`;
    }
    static verifyToken(token) {
        try {
            let t = token.trim();
            try {
                t = decodeURIComponent(t);
            }
            catch {
                /* mantener t si hay secuencias % inválidas */
            }
            const [ivHex, encrypted] = t.split(":");
            if (!ivHex || !encrypted)
                return null;
            const iv = Buffer.from(ivHex, "hex");
            const decipher = crypto.createDecipheriv(this.ALGORITHM, crypto.scryptSync(this.SECRET, "salt", 32), iv);
            let decrypted = decipher.update(encrypted, "hex", "utf8");
            decrypted += decipher.final("utf8");
            const payload = JSON.parse(decrypted);
            if (typeof payload.id_expedicion !== "number") {
                return null;
            }
            if (payload.id_cliente !== null &&
                payload.id_cliente !== undefined &&
                typeof payload.id_cliente !== "number") {
                return null;
            }
            payload.id_cliente = payload.id_cliente ?? null;
            const expiresAt = new Date(payload.expires_at);
            if (expiresAt < new Date()) {
                return null;
            }
            return payload;
        }
        catch {
            return null;
        }
    }
}
//# sourceMappingURL=jwt.service.js.map