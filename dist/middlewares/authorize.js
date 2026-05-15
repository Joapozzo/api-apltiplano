export function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.auth) {
            return res.status(401).json({
                success: false,
                error: "La solicitud no estA autenticada",
                code: "UNAUTHENTICATED",
            });
        }
        const hasAllowedRole = req.auth.roles.some((role) => allowedRoles.includes(role));
        if (!hasAllowedRole) {
            return res.status(403).json({
                success: false,
                error: "No tenEs permisos para acceder a este recurso",
                code: "FORBIDDEN",
            });
        }
        return next();
    };
}
//# sourceMappingURL=authorize.js.map