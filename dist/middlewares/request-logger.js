import { logger } from "../services/logger.service.js";
export function requestLogger(req, res, next) {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.originalUrl || req.url,
            statusCode: res.statusCode,
            responseTime: duration,
            contentLength: res.getHeader("content-length"),
        };
        if (res.statusCode >= 500) {
            logger.error(logData, "Request completed with server error");
        }
        else if (res.statusCode >= 400) {
            logger.warn(logData, "Request completed with client error");
        }
        else {
            logger.info(logData, "Request completed");
        }
    });
    next();
}
//# sourceMappingURL=request-logger.js.map