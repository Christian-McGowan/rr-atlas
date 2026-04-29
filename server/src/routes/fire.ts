import { Router } from "express";
import { getFireEvents } from "../data/fireEvents.js";

export const fireRouter = Router();

fireRouter.get("/", (req, res) => {
  const placeSlug = req.query.placeSlug ? String(req.query.placeSlug) : undefined;
  res.json(getFireEvents(placeSlug));
});
