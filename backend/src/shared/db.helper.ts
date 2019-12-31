import { Collection, MongoClient } from 'mongodb';

// Connection URL
const dbUrl = 'mongodb://localhost:27017';
// Database Name
const dbName = 'Orderz';
// Create a new MongoClient
let client: MongoClient;
export let db: any;
export let fitnessCollection: any;
export let collectionInfo: any;

export async function connect() {
  client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
  db = client.db(dbName);

  // Connect to Mongo and initiate DB with preset collections
  client.connect(function(err) {
    console.log('Connected successfully to server');
    db = client.db(dbName);
    collectionInfo = db.collection('collectionInfo');

    fitnessCollection = db.collection('fitness');
    fitnessCollection.insertOne({
      sprint: 10,
      pushUps: 15,
      benchpress: 40,
      squat: 45,
    });
    collectionInfo.insertOne({
      name: 'fitness',
      numberOfDatasets: 4,
      description: 'Track your progress in any disciplin and observe how you get better every day',
      numberOfEntries: 1,
    });
  });
}

export async function disconnect() {
  if (client) {
    console.log('DB: closing connection');
    await client.close();
    console.log('DB: connection closed');
  }
}

// a small wrapper around Collection.drop() that
// doesn't throw an error if the collection doesn't exist
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
