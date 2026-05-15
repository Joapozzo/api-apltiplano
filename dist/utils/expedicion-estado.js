/** Estados de expedición considerados publicables (listados y detalle usuario). */
const ACTIVOS = new Set(["A", "Activa"]);
export function expedicionEstaActivaPublica(estado) {
    return ACTIVOS.has(estado);
}
//# sourceMappingURL=expedicion-estado.js.map