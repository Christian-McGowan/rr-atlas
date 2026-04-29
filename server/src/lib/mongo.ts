import mongoose from "mongoose";

export async function connectMongoIfConfigured() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.log("[rr-atlas] MONGO_URI not set; running with in-memory demo data.");
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("[rr-atlas] connected to MongoDB");
  } catch (e) {
    console.log("[rr-atlas] Mongo connection failed; continuing with in-memory demo data.");
  }
}
