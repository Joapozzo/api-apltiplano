import { getVistaCalendario } from "../services/calendario.service.js";
import { asyncHandler } from "../middlewares/error-handler.js";
import { AppError } from "../utils/app-error.js";
export class CalendarioController {
    static getVistaCalendario = asyncHandler(async (req, res) => {
        if (!req.auth)
            throw new AppError("La solicitud no está autenticada", 401);
        const anio = Number(req.params.anio);
        const mes = Number(req.params.mes);
        if (!Number.isInteger(anio) || !Number.isInteger(mes) || mes < 1 || mes > 12) {
            throw new AppError("Parámetros de calendario inválidos", 400);
        }
        const data = await getVistaCalendario(anio, mes, req.auth.id_usuario);
        res.json({ success: true, data });
    });
}
//# sourceMappingURL=calendario.controller.js.map