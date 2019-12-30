import Router from 'koa-router';
import { Context } from 'koa';
import { MongoClient } from 'mongodb';

// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'Orderz';
// Create a new MongoClient
const client = new MongoClient(url);
let db: any;
let fitnessCollection: any;

// Connect to Mongo and initiate DB with preset collections
client.connect(function(err) {
  console.log('Connected successfully to server');
  db = client.db(dbName);
  fitnessCollection = db.collection('fitness');
  fitnessCollection.insertOne({ test: 'abc' });
  client.close().then(() => {
    console.log('Made Preset of Collections');
  });
});

// Routes
export function collectionController() {
  const router = new Router();

  router.get('', getAllCollections);
  router.post('/create', createNewCollection);
  router.post('/fitness/entry', addNewFitnessData);

  return router.routes();
}

export async function getAllCollections(ctx: Context) {
  console.log('API WORKS');
  ctx.status = 200;
  ctx.body = 'success';
}

export async function createNewCollection(ctx: Context) {
  const collectionName: string = ctx.request.body.name;
  const firstCollectionEntry = ctx.request.body.entry;
  console.log('collectionnmae: ', collectionName, 'entry: ', firstCollectionEntry);
  // Use connect method to connect to the Server
  await client.connect(function() {
    const newCollection = db.collection(collectionName);
    newCollection.insertOne(firstCollectionEntry);
    client.close();
  });

  console.log('created the new Collections');
  ctx.body = 'success';
  ctx.status = 200;
}

export async function addNewFitnessData(ctx: Context) {
  const fitnessData = ctx.request.body;
  await client.connect(function() {
    fitnessCollection.insertOne(fitnessData);
    client.close();
  });
}
