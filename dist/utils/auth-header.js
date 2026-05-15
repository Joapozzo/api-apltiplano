export function extractBearerToken(authorizationHeader) {
    if (!authorizationHeader) {
        return null;
    }
    const [scheme, token] = authorizationHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        return null;
    }
    return token.trim();
}
//# sourceMappingURL=auth-header.js.map