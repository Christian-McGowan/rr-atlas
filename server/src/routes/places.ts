import { Router } from "express";
import { getPlaceBySlug } from "../data/places.js";

export const placesRouter = Router();

placesRouter.get("/:slug", (req, res) => {
  const slug = req.params.slug;
  const place = getPlaceBySlug(slug);
  if (!place) return res.status(404).json({ message: "Not found" });
  return res.json(place);
});
