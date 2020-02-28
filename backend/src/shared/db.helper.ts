import { Collection, MongoClient } from 'mongodb';

// Connection URL
const dbUrl = process.env['DB_HOST'];
// Create a new MongoClient
let client: MongoClient;
export let db: any;
export let userDB: any;

export async function connect() {
  client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
  db = client.db('Orderz');
  userDB = client.db('UsersDB');

  // Connect to Mongo and initiate DB with preset collections
  client.connect(async function(err) {
    console.log('Connected successfully to server');
    const expDate = await userDB.collection('serverConfig').findOne({ expirationDate: { $exists: true } });
    const newExpDate = new Date().getTime() + 1000 * 60 * 60 * 24 * 7;
    if (!expDate) {
      await userDB.collection('serverConfig').insertOne({ expirationDate: newExpDate });
    } else if (expDate > new Date().getTime()) {
      await userDB.collection('serverConfig').updateOne({ expirationDate: { $exists: true } }, { expirationDate: newExpDate });
    }
  });
}

export async function createFitnessCollection(userCollection: string) {
  await db.collection(userCollection).insertOne({
    title: 'fitness',
    configuration: [
      { title: 'sprint', dataType: 'number' },
      { title: 'pushUps', dataType: 'number' },
      { title: 'benchpress', dataType: 'number' },
      { title: 'squat', dataType: 'number' },
    ],
    type: 'collection',
    data: [],
  });
  await db.collection(userCollection).insertOne({
    title: 'collectionInfo',
    numberOfCollections: 1,
    collectionsMeta: [
      {
        title: 'fitness',
        numberOfDatasets: 4,
        description: 'Track your progress in any disciplin and observe how you get better every day',
        numberOfEntries: 1,
        created: new Date(),
      },
    ],
  });
}

export async function disconnect() {
  if (client) {
    console.log('DB: closing connection');
    await client.close();
    console.log('DB: connection closed');
  }
}

export async function dropCollection(collection: Collection): Promise<void> {
  try {
    await collection.drop();
  } catch (err) {
    // Collection does not yet exist. That's fine. Do nothing.
  }
}

// intended for use in tests
export function dropDatabase() {
  return db ? db.dropDatabase() : Promise.resolve();
}
