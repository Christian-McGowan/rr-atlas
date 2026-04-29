import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app.js";
import { connectMongoIfConfigured } from "./lib/mongo.js";

const PORT = Number(process.env.PORT ?? 5050);

async function main() {
  await connectMongoIfConfigured();

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`[rr-atlas] server listening on http://localhost:${PORT}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
