import { Router } from "express";
import { ConfigService } from "../services/config.service.js";
import { CONFIG_REGISTRY, type ConfigKey } from "../utils/config-keys.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const allConfig = await ConfigService.getAll();

    const publicConfig: Record<string, Record<string, string>> = {
      contacto: {},
      branding: {},
    };

    for (const item of allConfig) {
      const metadata = CONFIG_REGISTRY[item.clave as ConfigKey];
      if (metadata?.publicReadable) {
        const grupo = item.grupo;
        if (!publicConfig[grupo]) {
          publicConfig[grupo] = {};
        }
        const parts = item.clave.split(".");
        const key = parts.length > 1 ? parts[1] : item.clave;
        if (key) {
          publicConfig[grupo][key] = item.valor;
        }
      }
    }

    res.json({
      success: true,
      data: publicConfig,
    });
  } catch (error) {
    console.error("Public config error:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener configuración pública",
    });
  }
});

export default router;