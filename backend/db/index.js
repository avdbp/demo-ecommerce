const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.warn('MONGODB_URI no está definida. La base de datos no se conectará.');
  process.exit(1);
}

const COLLECTIONS = ['products', 'users', 'orders', 'storages'];

mongoose
  .connect(MONGO_URI)
  .then(async (x) => {
    const dbName = x.connections[0].name;
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
  })
  .catch((err) => {
    console.error('Error connecting to mongo: ', err);
  });
