import pino from "pino";
export declare const logger: pino.Logger<never, boolean>;
export declare function createLogger(name: string): pino.Logger<never, boolean>;
export declare const loggers: {
    auth: pino.Logger<never, boolean>;
    inscripciones: pino.Logger<never, boolean>;
    servicios: pino.Logger<never, boolean>;
    expediciones: pino.Logger<never, boolean>;
    uploads: pino.Logger<never, boolean>;
    dashboard: pino.Logger<never, boolean>;
    calendar: pino.Logger<never, boolean>;
};
//# sourceMappingURL=logger.service.d.ts.map