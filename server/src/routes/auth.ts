import { Router } from "express";
import { z } from "zod";
import {
  createAccount,
  getAccountByToken,
  loginAccount,
  removeAccountLocation,
  saveAccountLocation,
  updateAccount
} from "../lib/accountStore.js";

export const authRouter = Router();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(128)
});

const registerSchema = credentialsSchema.extend({
  name: z.string().trim().min(2).max(80)
});

const preferencesSchema = z.object({
  emailAlerts: z.boolean(),
  inAppAlerts: z.boolean(),
  minimumSeverity: z.string().min(1).max(24),
  hazards: z.array(z.string().min(1).max(40)).max(12),
  weeklySummary: z.boolean(),
  quietHours: z.boolean()
});

const updateSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  preferences: preferencesSchema.optional()
});

const savedLocationSchema = z.object({
  slug: z.string().min(1).max(120),
  label: z.string().min(1).max(160),
  type: z.enum(["city", "zip"]),
  state: z.string().max(80).optional(),
  center: z.tuple([z.number(), z.number()]),
  addedAt: z.string().optional()
});

function getBearerToken(header: string | undefined) {
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  return scheme?.toLowerCase() === "bearer" && token ? token : null;
}

function validationMessage(error: z.ZodError) {
  return error.issues.map((issue) => issue.message).join(" ");
}

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: validationMessage(parsed.error) });

  try {
    const result = await createAccount(parsed.data);
    return res.status(201).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create account.";
    return res.status(409).json({ message });
  }
});

authRouter.post("/login", async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: validationMessage(parsed.error) });

  try {
    const result = await loginAccount(parsed.data);
    return res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to log in.";
    return res.status(401).json({ message });
  }
});

authRouter.get("/me", async (req, res) => {
  const token = getBearerToken(req.headers.authorization);
  if (!token) return res.status(401).json({ message: "Missing session token." });

  const account = await getAccountByToken(token);
  if (!account) return res.status(401).json({ message: "Invalid or expired session." });

  return res.json(account);
});

authRouter.patch("/me", async (req, res) => {
  const token = getBearerToken(req.headers.authorization);
  if (!token) return res.status(401).json({ message: "Missing session token." });

  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: validationMessage(parsed.error) });

  try {
    const account = await updateAccount(token, parsed.data);
    return res.json(account);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update account.";
    return res.status(401).json({ message });
  }
});

authRouter.post("/saved-locations", async (req, res) => {
  const token = getBearerToken(req.headers.authorization);
  if (!token) return res.status(401).json({ message: "Missing session token." });

  const parsed = savedLocationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: validationMessage(parsed.error) });

  try {
    const account = await saveAccountLocation(token, { ...parsed.data, addedAt: parsed.data.addedAt ?? new Date().toISOString() });
    return res.status(201).json(account);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save location.";
    return res.status(401).json({ message });
  }
});

authRouter.delete("/saved-locations/:slug", async (req, res) => {
  const token = getBearerToken(req.headers.authorization);
  if (!token) return res.status(401).json({ message: "Missing session token." });

  try {
    const account = await removeAccountLocation(token, req.params.slug);
    return res.json(account);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to remove location.";
    return res.status(401).json({ message });
  }
});
