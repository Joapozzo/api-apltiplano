export declare const EXPEDICION_ESTADOS: {
    readonly ACTIVA: "Activa";
    readonly COMPLETA: "Completa";
    readonly FINALIZADA: "Finalizada";
    readonly SUSPENDIDA: "Suspendida";
    readonly CANCELADA: "Cancelada";
};
export type ExpedicionEstado = (typeof EXPEDICION_ESTADOS)[keyof typeof EXPEDICION_ESTADOS];
export declare function expedicionEsOperativa(estado: string): boolean;
export declare function expedicionEstaActivaPublica(estado: string): boolean;
export declare function expedicionEstaFinalizada(estado: string): boolean;
export declare function expedicionEstaCancelada(estado: string): boolean;
export declare function esEstadoValido(estado: string): estado is ExpedicionEstado;
//# sourceMappingURL=expedicion-estado.d.ts.map