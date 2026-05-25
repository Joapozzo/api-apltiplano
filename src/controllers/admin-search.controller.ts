import type { Request, Response } from "express";
import { z } from "zod";
import { AdminSearchService } from "../services/admin-search.service.js";
import type { ApiSuccessResponse } from "../types/api.types.js";

const searchQuerySchema = z.object({
  q: z.string().min(1).max(100),
  limit: z.coerce.number().min(1).max(10).optional(),
});

export class AdminSearchController {
  static async search(req: Request, res: Response) {
    const parsed = searchQuerySchema.parse(req.query);
    const params: { q: string; limit?: number } = { q: parsed.q };
    if (parsed.limit !== undefined) {
      params.limit = parsed.limit;
    }
    const results = await AdminSearchService.search(params);

    res.json({
      success: true,
      data: {
        results,
      },
    } as ApiSuccessResponse<{ results: typeof results }>);
  }
}
