import { Router } from "express";
import { getRiskForPlace } from "../data/places.js";

export const riskRouter = Router();

riskRouter.get("/:placeSlug", (req, res) => {
  const placeSlug = req.params.placeSlug;
  const risk = getRiskForPlace(placeSlug);
  if (!risk) return res.status(404).json({ message: "Not found" });
  return res.json(risk);
});
