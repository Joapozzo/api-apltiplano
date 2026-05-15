import { describe, it, expect, vi } from "vitest";
import { createLogger, loggers } from "./logger.service.js";
describe("Logger Service", () => {
    it("should create a logger", () => {
        const logger = createLogger("test-module");
        expect(logger).toBeDefined();
    });
    it("should have child loggers for each domain", () => {
        expect(loggers.auth).toBeDefined();
        expect(loggers.inscripciones).toBeDefined();
        expect(loggers.servicios).toBeDefined();
        expect(loggers.expediciones).toBeDefined();
    });
    it("should log info messages", () => {
        const logger = createLogger("test");
        const logSpy = vi.spyOn(logger, "info");
        logger.info({ test: true }, "Test message");
        expect(logSpy).toHaveBeenCalledWith({ test: true }, "Test message");
    });
    it("should log warn messages", () => {
        const logger = createLogger("test");
        const logSpy = vi.spyOn(logger, "warn");
        logger.warn({ test: true }, "Warning message");
        expect(logSpy).toHaveBeenCalledWith({ test: true }, "Warning message");
    });
    it("should log error messages", () => {
        const logger = createLogger("test");
        const logSpy = vi.spyOn(logger, "error");
        const error = new Error("Test error");
        logger.error({ err: error }, "Error message");
        expect(logSpy).toHaveBeenCalled();
    });
});
//# sourceMappingURL=logger.service.test.js.map