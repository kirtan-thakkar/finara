import mongoose from 'mongoose';
import { MongoClient , ServerApiVersion } from 'mongodb';
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function ConnectDb() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}
let client;

if (process.env.NODE_ENV === "development") {
  // Use a global variable to preserve the client across HMR reloads
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(MONGODB_URI, options);
  }
  client = global._mongoClient;
} else {
  // In production, create a new client
  client = new MongoClient(MONGODB_URI, options);
}


export {ConnectDb,client};
