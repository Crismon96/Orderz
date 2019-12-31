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
  router.post('/create', createNewCollection);
  router.post('/fitness/entry', addNewFitnessData);

  return router.routes();
}

export async function getAllCollections(ctx: Context) {
  // TODO: Store the information about the collection in the first entry or in different collection
  const allCollections = await db.getCollection('collectionInfo').find({});
  console.log('THIS ARE ALL COLLECTIONS: ', allCollections);
  /*  const allCollections = (await db.listCollections().toArray()).map((col: any) => {
    return col.name;
  });*/
  ctx.status = 200;
  ctx.body = allCollections;
}

export async function createNewCollection(ctx: Context) {
  const newCollectionObj: CreateNewCollection = ctx.request.body;

  const newCollection = await db.collection(newCollectionObj.name);
  await newCollection.insertOne(newCollectionObj.entry);

  console.log('created the new Collection: ' + newCollectionObj.name);
  if (newCollection) {
    ctx.body = newCollectionObj;
    ctx.status = 200;
  } else {
    ctx.body = 'Error while trying to create new Collection';
    ctx.status = 400;
  }
}

export async function addNewFitnessData(ctx: Context) {
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
