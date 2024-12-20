import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  throw new Error('MONGO_URL is not set');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGO_URL, opts)
      .then((mongoose) => {
        console.log('Connected to database');
        return mongoose;
      })
      .catch((error) => {
        console.error('Error connecting to database:', error);
        throw new Error('Database connection failed');
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

connectToDatabase();