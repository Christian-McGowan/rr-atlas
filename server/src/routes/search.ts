import { Router } from "express";
import { z } from "zod";
import { resolveSearch } from "../lib/geo.js";

export const searchRouter = Router();

searchRouter.get("/", (req, res) => {
  const schema = z.object({ q: z.string().min(1) });
  const parsed = schema.safeParse({ q: req.query.q });

  if (!parsed.success) {
    return res.status(400).json({ message: "Missing query param q" });
  }

  const result = resolveSearch(parsed.data.q);
  return res.json(result);
});
