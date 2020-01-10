import Router from 'koa-router';
import { Context } from 'koa';
import { db } from '../shared/db.helper';
import { FitnessEntry } from '../../../sharedModules/schemaInterfaces/fitness-POST-addNewEntry.schema';
import { CreateNewCollection } from '../../../sharedModules/schemaInterfaces/collection-POST-createNewCollection.schema';
import { MongoError } from 'mongodb';
// Routes
export function collectionController() {
  const router = new Router();

  router.get('', getAllCollections);
  router.get('/collection', getSpecificCollection);
  router.put('/create', createNewCollection);
  router.put('/fitness/datapoint', addNewFitnessDatapoint);
  router.put('/datapoint', createNewDatapointForCollection);

  return router.routes();
}

async function getAllCollections(ctx: Context) {
  const allCollections = await db
    .collection('username')
    .find({ type: 'collection' })
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
  const collectionName: string = ctx.query.name;
  const specCollection = await db.collection('username').findOne({ title: collectionName });
  if (specCollection) {
    ctx.body = specCollection.configuration;
    ctx.status = 200;
  } else {
    ctx.body = 'Could not find the queried collection';
    ctx.status = 400;
  }
}

async function createNewCollection(ctx: Context) {
  const newCollectionObj: CreateNewCollection = ctx.request.body;
  const newCollection = await db.collection('username').insertOne({ configuration: newCollectionObj.datasets });

  await db
    .collection('username')
    .updateOne(
      { title: 'collectionInfo' },
      {
        $push: {
          collectionsMeta: {
            title: newCollectionObj.collectionTitle,
            numberOfDatasets: newCollectionObj.datasets.length,
            description: newCollectionObj.collectionDescription,
            numberOfEntries: 1,
            created: new Date(),
          },
        },
      }
    )
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

async function addNewFitnessDatapoint(ctx: Context) {
  const fitnessData: FitnessEntry = ctx.request.body;
  await db
    .collection('username')
    .updateOne({ title: 'fitness' }, { $push: { data: { fitnessData } } })
    .then(async () => {
      await db.collection('username').updateOne({ title: 'collectionInfo', collectionsMeta: { title: 'fitness' } }, { $inc: { numberOfEntries: +1 } });
      ctx.body = fitnessData;
      ctx.status = 200;
    })
    .catch((err: MongoError) => {
      ctx.body = 'Error trying to add new fitness entry: ' + err;
      ctx.status = 400;
    });
}

async function createNewDatapointForCollection(ctx: Context) {
  const targedCollectionName = ctx.query.collection;
  let newDatapoints = ctx.request.body;
  newDatapoints.map((entry: any) => {
    entry.submissionDate = new Date();
  });
  await db
    .collection('username')
    .updateMany({ title: targedCollectionName }, { $push: { data: { newDatapoints } } })
    .catch(() => {
      ctx.body = 'Didnt find the collection you were looking for';
      ctx.status = 400;
    });
  await db
    .collection('username')
    .updateOne({ title: 'collectionInfo', collectionsMeta: { title: targedCollectionName } }, { $inc: { numberOfEntries: +1 } })
    .then(() => {
      ctx.body = ctx.request.body;
      ctx.status = 200;
    })
    .catch(() => {
      ctx.body = 'Couldnt adjust the collection information according to input.';
      ctx.status = 400;
    });
}
