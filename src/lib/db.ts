import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Connected to MongoDB: ", MONGODB_URI.split('@')[1]);
      return mongoose;
    }).catch(err => {
      console.error("MongoDB Connection Error: ", err);
      throw new Error("Database Connection Error. Please check your internet or MONGODB_URI.");
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
