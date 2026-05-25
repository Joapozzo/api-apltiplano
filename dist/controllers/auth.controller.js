import { z } from "zod";
import { AuthService } from "../services/auth.service.js";
import { extractBearerToken } from "../utils/auth-header.js";
import { issueCsrfToken } from "../middlewares/csrf.js";
import { asyncHandler } from "../middlewares/error-handler.js";
const registerSchema = z.object({
    nombre: z.string().trim().optional(),
    apellido: z.string().trim().optional(),
    username: z.string().trim().min(1).optional(),
});
export class AuthController {
    static csrf = asyncHandler(async (req, res) => {
        const csrfToken = issueCsrfToken(req, res);
        res.json({ success: true, csrfToken });
    });
    static register = asyncHandler(async (req, res) => {
        const token = extractBearerToken(req.header("authorization"));
        if (!token) {
            res.status(401).json({
                success: false,
                error: "Falta el token Bearer de Firebase",
                code: "MISSING_BEARER_TOKEN",
            });
            return;
        }
        const payload = registerSchema.parse(req.body);
        const result = await AuthService.registerWithFirebaseToken(token, {
            ...(payload.nombre ? { nombre: payload.nombre } : {}),
            ...(payload.apellido ? { apellido: payload.apellido } : {}),
            ...(payload.username ? { username: payload.username } : {}),
        });
        const csrfToken = issueCsrfToken(req, res);
        res.status(result.message.includes("registrado") ? 201 : 200).json({
            ...result,
            csrfToken,
        });
    });
    static me = asyncHandler(async (req, res) => {
        const token = extractBearerToken(req.header("authorization"));
        if (!token) {
            res.status(401).json({
                success: false,
                error: "Falta el token Bearer de Firebase",
                code: "MISSING_BEARER_TOKEN",
            });
            return;
        }
        const result = await AuthService.getCurrentUser(token);
        const csrfToken = issueCsrfToken(req, res);
        res.json({ ...result, csrfToken });
    });
}
//# sourceMappingURL=auth.controller.js.map