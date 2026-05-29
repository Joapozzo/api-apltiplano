import cors from "cors";
function normalizeOrigin(value) {
    let origin = value.trim().replace(/\/$/, "");
    if (!origin)
        return origin;
    if (!origin.startsWith("http://") && !origin.startsWith("https://")) {
        origin = `https://${origin}`;
    }
    return origin;
}
function parseOrigins(origins) {
    if (!origins || origins.trim() === "") {
        return ["http://localhost:3000"];
    }
    return origins
        .split(",")
        .map((o) => normalizeOrigin(o))
        .filter((o) => o.length > 0);
}
const originSource = process.env.ALLOWED_ORIGINS
    ? "ALLOWED_ORIGINS"
    : process.env.FRONTEND_URL
        ? "FRONTEND_URL"
        : "default";
const allowedOrigins = parseOrigins(process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL);
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (server-to-server, mobile apps, Postman, etc.)
        if (!origin) {
            callback(null, true);
            return;
        }
        const normalizedRequestOrigin = normalizeOrigin(origin);
        if (allowedOrigins.includes(normalizedRequestOrigin)) {
            callback(null, true);
        }
        else {
            callback(new Error(`Origin "${origin}" not allowed by CORS.\n` +
                `  Source: ${originSource}\n` +
                `  Allowed: ${allowedOrigins.join(", ")}`));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
};
export default cors(corsOptions);
//# sourceMappingURL=cors.js.map