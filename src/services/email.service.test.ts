import { describe, it, expect } from "vitest";
import {
  generateInscripcionClienteEmail,
  generateInscripcionAdminEmail,
} from "./email.service.js";

describe("Email Service", () => {
  const mockData = {
    cliente: {
      nombre: "Juan",
      apellido: "Perez",
      email: "juan@test.com",
    },
    servicio: {
      nombre: "Aconcagua Expedition",
      slug: "aconcagua-expedition",
    },
    expedicion: {
      fecha_salida: "2026-06-15T00:00:00.000Z",
      fecha_fin: "2026-06-25T00:00:00.000Z",
    },
    inscripcion: {
      id: 123,
      estado: "Inscripto",
    },
  };

  describe("generateInscripcionClienteEmail", () => {
    it("should generate email with correct recipient", () => {
      const email = generateInscripcionClienteEmail(mockData);
      expect(email.to).toBe("juan@test.com");
    });

    it("should include service name in subject", () => {
      const email = generateInscripcionClienteEmail(mockData);
      expect(email.subject).toContain("Aconcagua Expedition");
    });

    it("should include confirmation in subject", () => {
      const email = generateInscripcionClienteEmail(mockData);
      expect(email.subject).toContain("Confirmación");
    });

    it("should have html content", () => {
      const email = generateInscripcionClienteEmail(mockData);
      expect(email.html).toContain("<!DOCTYPE html>");
      expect(email.html).toContain("Juan Perez");
    });

    it("should format dates in Argentine format", () => {
      const email = generateInscripcionClienteEmail(mockData);
      expect(email.html).toContain("6/2026");
      expect(email.html).toContain("2026");
    });
  });

  describe("generateInscripcionAdminEmail", () => {
    it("should send to admin email", () => {
      const email = generateInscripcionAdminEmail(mockData);
      expect(email.to).toBe("info@altiplanoexperience.com");
    });

    it("should include cliente info", () => {
      const email = generateInscripcionAdminEmail(mockData);
      expect(email.html).toContain("Juan Perez");
      expect(email.html).toContain("juan@test.com");
    });

    it("should include inscription id", () => {
      const email = generateInscripcionAdminEmail(mockData);
      expect(email.html).toContain("#123");
    });

    it("should include additional fields when provided", () => {
      const email = generateInscripcionAdminEmail({
        ...mockData,
        clienteTelefono: "123456789",
        clienteDni: "12345678",
      });
      expect(email.html).toContain("123456789");
      expect(email.html).toContain("12345678");
    });
  });
});