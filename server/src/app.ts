import express from "express";
import cors from "cors";

import { searchRouter } from "./routes/search.js";
import { placesRouter } from "./routes/places.js";
import { riskRouter } from "./routes/risk.js";
import { fireRouter } from "./routes/fire.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/search", searchRouter);
  app.use("/api/places", placesRouter);
  app.use("/api/risk", riskRouter);
  app.use("/api/fire", fireRouter);

  // Generic events + resources
  app.get("/api/events", async (req, res) => {
    const placeSlug = String(req.query.placeSlug ?? "");
    const { getEventsForPlace } = await import("./data/fireEvents.js");
    // In this mock, /api/events returns mixed hazards (not just fire)
    res.json(getEventsForPlace(placeSlug, { hazard: "any" }));
  });

  app.get("/api/resources/:placeSlug", async (req, res) => {
    const placeSlug = req.params.placeSlug;
    const { getResourcesForPlace } = await import("./data/resources.js");
    res.json(getResourcesForPlace(placeSlug));
  });

  return app;
}
