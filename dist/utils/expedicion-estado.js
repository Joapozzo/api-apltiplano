export const EXPEDICION_ESTADOS = {
    ACTIVA: "Activa",
    COMPLETA: "Completa",
    FINALIZADA: "Finalizada",
    SUSPENDIDA: "Suspendida",
    CANCELADA: "Cancelada",
};
const ESTADOS_OPERATIVOS = new Set([EXPEDICION_ESTADOS.ACTIVA, EXPEDICION_ESTADOS.COMPLETA]);
const ESTADOS_PUBLICABLES = new Set(["A", EXPEDICION_ESTADOS.ACTIVA]);
const ESTADOS_FINALIZADOS = new Set([
    EXPEDICION_ESTADOS.COMPLETA,
    EXPEDICION_ESTADOS.FINALIZADA,
    EXPEDICION_ESTADOS.SUSPENDIDA,
    EXPEDICION_ESTADOS.CANCELADA,
]);
const ESTADOS_CANCELADOS = new Set([EXPEDICION_ESTADOS.CANCELADA, EXPEDICION_ESTADOS.SUSPENDIDA]);
export function expedicionEsOperativa(estado) {
    return ESTADOS_OPERATIVOS.has(estado);
}
export function expedicionEstaActivaPublica(estado) {
    return ESTADOS_PUBLICABLES.has(estado);
}
export function expedicionEstaFinalizada(estado) {
    return ESTADOS_FINALIZADOS.has(estado);
}
export function expedicionEstaCancelada(estado) {
    return ESTADOS_CANCELADOS.has(estado);
}
export function esEstadoValido(estado) {
    return Object.values(EXPEDICION_ESTADOS).includes(estado);
}
//# sourceMappingURL=expedicion-estado.js.map