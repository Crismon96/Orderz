import Router from 'koa-router';
import { Context } from 'koa';
import { db } from '../shared/db.helper';
import { FitnessEntry } from '../../../sharedModules/schemaInterfaces/fitness-POST-addNewEntry.schema';
import { CreateNewCollection } from '../../../sharedModules/schemaInterfaces/collection-POST-createNewCollection.schema';
import { MongoError } from 'mongodb';
import { validateJWT } from '../auth/encryption.service';
import { ICollectionInfo } from '../../../frontend/src/shared/IcollectionInfo';

// Routes
export function collectionController() {
  const router = new Router();

  router.get('', validateJWT, getAllCollections);
  router.get('/collection', validateJWT, getSpecificCollection);
  router.delete('/collection', validateJWT, deleteCollection);
  router.put('/create', validateJWT, createNewCollection);
  router.put('/fitness/datapoint', validateJWT, addNewFitnessDatapoint);
  router.put('/datapoint', validateJWT, createNewDatapointForCollection);
  router.get('/data', validateJWT, getSpecificCollectionData);

  return router.routes();
}

async function getAllCollections(ctx: Context) {
  const username = ctx.state.username;

  let allCollections = await db.collection(username).findOne({ title: 'collectionInfo' });
  allCollections = allCollections.collectionsMeta;
  if (allCollections) {
    ctx.status = 200;
    ctx.body = allCollections;
  } else {
    ctx.throw(400, 'Could not find the collection info bundle');
  }
}

async function getSpecificCollection(ctx: Context) {
  const collectionName: string = ctx.query.name;
  const username = ctx.state.username;

  const specCollection = await db.collection(username).findOne({ title: collectionName });
  if (specCollection) {
    ctx.body = {
      title: specCollection.title,
      configuration: specCollection.configuration,
    };
    ctx.status = 200;
  } else {
    ctx.throw(400, 'Could not find the queried collection');
  }
}

async function deleteCollection(ctx: Context) {
  const collectionName: string = ctx.query.name;
  const username = ctx.state.username;

  const allCollectionMeta = await db.collection(username).findOne({ title: 'collectionInfo' });
  const deletedCollection = allCollectionMeta.collectionsMeta.find((coll: any) => {
    return coll.title === collectionName;
  });

  await db.collection(username).deleteOne({ title: collectionName });
  await db.collection(username).updateOne({ title: 'collectionInfo' }, { $inc: { numberOfCollections: -1 } });

  const collectionsMetaInfo = await db.collection(username).findOne({ title: 'collectionInfo' });
  const deletedMetaIndex = collectionsMetaInfo.collectionsMeta.findIndex((collection: any) => {
    return collection.title === collectionName;
  });
  if (deletedMetaIndex !== -1) {
    collectionsMetaInfo.collectionsMeta.splice(deletedMetaIndex, 1);
  }

  const success = await db.collection(username).replaceOne({ title: 'collectionInfo' }, collectionsMetaInfo);
  if (success && deletedCollection) {
    ctx.body = deletedCollection;
    ctx.status = 200;
  } else {
    ctx.throw(400, 'Could not delete the target collection or configure the meta information');
  }
}

async function createNewCollection(ctx: Context) {
  const newCollectionObj: CreateNewCollection = ctx.request.body;
  const username = ctx.state.username;

  const newCollection = await db
    .collection(username)
    .insertOne({ title: newCollectionObj.collectionTitle, configuration: newCollectionObj.datasets, type: 'collection', data: [] });

  await db.collection(username).updateOne({ title: 'collectionInfo' }, { $inc: { numberOfCollections: 1 } });
  await db
    .collection(username)
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
      ctx.throw(400, 'Error while trying to create new Collection');
    });
}
// This Api is not getting used right now.
async function addNewFitnessDatapoint(ctx: Context) {
  const fitnessData: FitnessEntry = ctx.request.body.newDatapoints;
  const username = ctx.state.username;

  await db
    .collection(username)
    .updateOne({ title: 'fitness' }, { $push: { data: { fitnessData } } })
    .then(() => {
      ctx.body = fitnessData;
      ctx.status = 200;
    })
    .catch((err: MongoError) => {
      ctx.throw(400, 'Error trying to add new fitness entry: ' + err);
    });
  await db.collection(username).updateOne({ title: 'collectionInfo', collectionsMeta: { title: 'fitness' } }, { $inc: { numberOfEntries: +1 } });
}

async function createNewDatapointForCollection(ctx: Context) {
  const targedCollectionName = ctx.query.collection;
  const username = ctx.state.username;

  let newDatapoints = ctx.request.body;
  newDatapoints.map((entry: any) => {
    entry.submissionDate = new Date();
  });
  await db
    .collection(username)
    .updateMany({ title: targedCollectionName }, { $push: { data: { $each: newDatapoints } } })
    .catch(() => {
      ctx.throw(400, 'Didnt find the collection you were looking for');
    });

  const updatedCollectionInfo = await db.collection(username).findOne({ 'collectionsMeta.title': targedCollectionName });
  updatedCollectionInfo.collectionsMeta.find((doc: ICollectionInfo) => (doc.title = targedCollectionName)).numberOfEntries++;

  await db
    .collection(username)
    .replaceOne({ title: 'collectionInfo' }, updatedCollectionInfo)
    .then(() => {
      ctx.body = ctx.request.body;
      ctx.status = 200;
    })
    .catch(() => {
      ctx.throw(400, 'Couldnt adjust the collection information according to input.');
    });
}

async function getSpecificCollectionData(ctx: Context) {
  const collectionName = ctx.query.collection;
  const username = ctx.state.username;

  const targedCollection = await db.collection(username).findOne({ title: collectionName });
  if (targedCollection) {
    ctx.body = targedCollection.data;
    ctx.status = 200;
  } else {
    ctx.throw(400, 'The collection you are looking for wasnt found.');
  }
}
