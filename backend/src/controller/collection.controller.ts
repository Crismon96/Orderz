import Router from 'koa-router';
import { Context } from 'koa';
import { db, fitnessCollection, collectionInfo } from '../shared/db.helper';
import { FitnessEntry } from '../../../sharedModules/schemaInterfaces/fitness-POST-addNewEntry.schema';
import { CreateNewCollection } from '../../../sharedModules/schemaInterfaces/collection-POST-createNewCollection.schema';
import { MongoError } from 'mongodb';
// Routes
export function collectionController() {
  const router = new Router();

  router.get('', getAllCollections);
  router.get('/collection', getSpecificCollection);
  router.put('/create', createNewCollection);
  router.post('/fitness/entry', addNewFitnessData);

  return router.routes();
}

async function getAllCollections(ctx: Context) {
  // TODO: Store the information about the collection in the first entry or in different collection
  const allCollections = await db
    .collection('collectionInfo')
    .find({})
    .toArray();
  if (allCollections) {
    ctx.status = 200;
    ctx.body = allCollections;
  } else {
    ctx.body = 'Could not find the collection info bundle';
    ctx.status = 400;
  }
}

async function getSpecificCollection(ctx: Context) {
  const collectionName: string = ctx.request.query.name;
  const specCollection = await db.collection(collectionName).findOne({ configuration: { $exists: true, $ne: null } });
  if (specCollection) {
    ctx.body = specCollection;
    ctx.status = 200;
  } else {
    ctx.body = 'Could not find the queried collection';
    ctx.status = 400;
  }
}

async function createNewCollection(ctx: Context) {
  const newCollectionObj: CreateNewCollection = ctx.request.body;

  const newCollection = await db.collection(newCollectionObj.collectionTitle);
  await newCollection.insertOne({ configuration: newCollectionObj.datasets });

  await collectionInfo
    .insertOne({
      name: newCollectionObj.collectionTitle,
      numberOfDatasets: newCollectionObj.datasets.length,
      description: newCollectionObj.collectionDescription,
      numberOfEntries: 1,
    })
    .then(() => {
      if (newCollection) {
        ctx.body = newCollectionObj;
        ctx.status = 200;
      }
    })
    .catch(() => {
      ctx.body = 'Error while trying to create new Collection';
      ctx.status = 400;
    });
}

async function addNewFitnessData(ctx: Context) {
  const fitnessData: FitnessEntry = ctx.request.body;
  await fitnessCollection
    .insertOne(fitnessData)
    .then(() => {
      ctx.body = fitnessData;
      ctx.status = 200;
    })
    .catch((err: MongoError) => {
      ctx.body = 'Error trying to add new fitness entry: ' + err;
      ctx.status = 400;
    });
}
