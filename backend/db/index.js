const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.warn('MONGODB_URI no está definida. La base de datos no se conectará.');
}

const COLLECTIONS = ['products', 'users', 'orders', 'storages'];

// Cached connection for serverless environments
let cached = global.mongooseConnection;
if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null };
}

async function connectDB() {
  if (!MONGO_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then(async (mongooseInstance) => {
      const dbName = mongooseInstance.connections[0].name;
      console.log(`Connected to Mongo! Database name: "${dbName}"`);

      const db = mongoose.connection.db;
      const existing = await db.listCollections().toArray();
      const existingNames = existing.map((c) => c.name);
      for (const name of COLLECTIONS) {
        if (!existingNames.includes(name)) {
          await db.createCollection(name);
          console.log(`Colección creada: ${name}`);
        }
      }

      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Start connection immediately (non-blocking)
if (MONGO_URI) {
  connectDB().catch((err) => console.error('Error connecting to mongo: ', err));
}

module.exports = connectDB;
