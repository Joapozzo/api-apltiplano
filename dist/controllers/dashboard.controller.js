import { getDashboardResumen } from "../services/dashboard/dashboard-resumen.service.js";
import { getDashboardActividad } from "../services/dashboard/dashboard-actividad.service.js";
import { getDashboardAlertas } from "../services/dashboard/dashboard-alertas.service.js";
import { AppError } from "../utils/app-error.js";
function handleDashboardError(error, res, fallbackMessage) {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            error: error.message,
        });
    }
    return res.status(500).json({
        success: false,
        error: fallbackMessage,
    });
}
export class DashboardController {
    static async getResumen(req, res) {
        try {
            const now = new Date();
            const fechaDesde = req.query.fecha_desde
                ? new Date(String(req.query.fecha_desde))
                : new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
            const fechaHasta = req.query.fecha_hasta
                ? new Date(String(req.query.fecha_hasta))
                : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            if (Number.isNaN(fechaDesde.getTime()) || Number.isNaN(fechaHasta.getTime())) {
                throw new AppError("Las fechas enviadas no son válidas", 400);
            }
            const data = await getDashboardResumen({
                fecha_desde: fechaDesde,
                fecha_hasta: fechaHasta,
            });
            return res.json({
                success: true,
                data,
            });
        }
        catch (error) {
            return handleDashboardError(error, res, "No se pudo obtener el resumen del dashboard");
        }
    }
    static async getActividad(req, res) {
        try {
            const data = await getDashboardActividad();
            return res.json({
                success: true,
                data,
            });
        }
        catch (error) {
            return handleDashboardError(error, res, "No se pudo obtener la actividad del dashboard");
        }
    }
    static async getAlertas(req, res) {
        try {
            const data = await getDashboardAlertas();
            return res.json({
                success: true,
                data,
            });
        }
        catch (error) {
            return handleDashboardError(error, res, "No se pudieron obtener las alertas del dashboard");
        }
    }
}
//# sourceMappingURL=dashboard.controller.js.map