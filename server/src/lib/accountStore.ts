import { promises as fs } from "fs";
import path from "path";
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "crypto";

export type SavedLocation = {
  slug: string;
  label: string;
  type: "city" | "zip";
  state?: string;
  center: [number, number];
  addedAt: string;
};

export type AlertPreferences = {
  emailAlerts: boolean;
  inAppAlerts: boolean;
  minimumSeverity: string;
  hazards: string[];
  weeklySummary: boolean;
  quietHours: boolean;
};

type AccountRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
  updatedAt: string;
  savedLocations: SavedLocation[];
  preferences: AlertPreferences;
};

export type PublicAccount = Omit<AccountRecord, "passwordHash" | "passwordSalt">;

type AccountStoreFile = {
  accounts: AccountRecord[];
};

const DEFAULT_PREFERENCES: AlertPreferences = {
  emailAlerts: true,
  inAppAlerts: true,
  minimumSeverity: "Medium",
  hazards: ["Wildfire", "Flood", "Severe storm"],
  weeklySummary: true,
  quietHours: false
};

const cwd = process.cwd();
const serverRoot = path.basename(cwd) === "server" ? cwd : path.join(cwd, "server");
const accountFilePath = process.env.ACCOUNTS_FILE ?? path.join(serverRoot, ".prototype", "accounts.json");
const sessions = new Map<string, string>();

async function ensureStoreFile() {
  await fs.mkdir(path.dirname(accountFilePath), { recursive: true });
  try {
    await fs.access(accountFilePath);
  } catch {
    await fs.writeFile(accountFilePath, JSON.stringify({ accounts: [] }, null, 2));
  }
}

async function readStore(): Promise<AccountStoreFile> {
  await ensureStoreFile();
  const raw = await fs.readFile(accountFilePath, "utf8");
  try {
    const parsed = JSON.parse(raw) as AccountStoreFile;
    return { accounts: Array.isArray(parsed.accounts) ? parsed.accounts : [] };
  } catch {
    return { accounts: [] };
  }
}

async function writeStore(store: AccountStoreFile) {
  await ensureStoreFile();
  await fs.writeFile(accountFilePath, JSON.stringify(store, null, 2));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashPassword(password: string, salt: string) {
  return scryptSync(password, salt, 64).toString("hex");
}

function toPublicAccount(account: AccountRecord): PublicAccount {
  const { passwordHash, passwordSalt, ...safeAccount } = account;
  void passwordHash;
  void passwordSalt;
  return safeAccount;
}

function issueToken(accountId: string) {
  const token = randomBytes(32).toString("hex");
  sessions.set(token, accountId);
  return token;
}

export async function createAccount(input: { name: string; email: string; password: string }) {
  const store = await readStore();
  const email = normalizeEmail(input.email);
  const existing = store.accounts.find((account) => account.email === email);

  if (existing) {
    throw new Error("An account already exists for that email address.");
  }

  const salt = randomBytes(16).toString("hex");
  const now = new Date().toISOString();
  const account: AccountRecord = {
    id: randomUUID(),
    name: input.name.trim(),
    email,
    passwordHash: hashPassword(input.password, salt),
    passwordSalt: salt,
    createdAt: now,
    updatedAt: now,
    savedLocations: [],
    preferences: { ...DEFAULT_PREFERENCES }
  };

  store.accounts.push(account);
  await writeStore(store);

  return { token: issueToken(account.id), user: toPublicAccount(account) };
}

export async function loginAccount(input: { email: string; password: string }) {
  const store = await readStore();
  const account = store.accounts.find((candidate) => candidate.email === normalizeEmail(input.email));

  if (!account) {
    throw new Error("Invalid email or password.");
  }

  const expected = Buffer.from(account.passwordHash, "hex");
  const actual = Buffer.from(hashPassword(input.password, account.passwordSalt), "hex");

  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    throw new Error("Invalid email or password.");
  }

  return { token: issueToken(account.id), user: toPublicAccount(account) };
}

export async function getAccountByToken(token: string) {
  const accountId = sessions.get(token);
  if (!accountId) return null;
  const store = await readStore();
  const account = store.accounts.find((candidate) => candidate.id === accountId);
  return account ? toPublicAccount(account) : null;
}

async function updateAccountRecord(accountId: string, updater: (account: AccountRecord) => AccountRecord) {
  const store = await readStore();
  const index = store.accounts.findIndex((account) => account.id === accountId);

  if (index === -1) {
    throw new Error("Account not found.");
  }

  const updated = updater(store.accounts[index]);
  updated.updatedAt = new Date().toISOString();
  store.accounts[index] = updated;
  await writeStore(store);
  return toPublicAccount(updated);
}

export async function updateAccount(token: string, input: { name?: string; preferences?: AlertPreferences }) {
  const accountId = sessions.get(token);
  if (!accountId) throw new Error("Invalid session.");

  return updateAccountRecord(accountId, (account) => ({
    ...account,
    name: input.name?.trim() ?? account.name,
    preferences: input.preferences ?? account.preferences
  }));
}

export async function saveAccountLocation(token: string, location: SavedLocation) {
  const accountId = sessions.get(token);
  if (!accountId) throw new Error("Invalid session.");

  return updateAccountRecord(accountId, (account) => {
    const nextLocation = {
      ...location,
      addedAt: location.addedAt || new Date().toISOString()
    };
    const withoutDuplicate = account.savedLocations.filter((saved) => saved.slug !== location.slug);
    return {
      ...account,
      savedLocations: [nextLocation, ...withoutDuplicate].slice(0, 25)
    };
  });
}

export async function removeAccountLocation(token: string, slug: string) {
  const accountId = sessions.get(token);
  if (!accountId) throw new Error("Invalid session.");

  return updateAccountRecord(accountId, (account) => ({
    ...account,
    savedLocations: account.savedLocations.filter((location) => location.slug !== slug)
  }));
}
