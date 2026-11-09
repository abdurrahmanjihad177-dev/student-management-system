 import dns from "node:dns";
import mongoose from "mongoose";

// DNS সমস্যা (querySrv ECONNREFUSED) এড়াতে Google DNS ব্যবহার
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI .env.local ফাইলে সেট করুন");
}

// Hot reload-এর সময় বারবার connection না খোলার জন্য cache
let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .catch((err) => {
        cached.promise = null; // fail হলে পরেরবার আবার চেষ্টা করবে
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}