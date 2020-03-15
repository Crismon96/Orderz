import Router from 'koa-router';
import { Context } from 'koa';
import { db } from '../shared/db.helper';
import { FitnessEntry } from '../../../sharedModules/schemaInterfaces/fitness-POST-addNewEntry.schema';
import { CreateNewCollection } from '../../../sharedModules/schemaInterfaces/collection-POST-createNewCollection.schema';
import { MongoError } from 'mongodb';
import { validateJWT } from '../auth/encryption.service';
import { ICollectionConfig, ICollectionInfo } from '../../../frontend/src/shared/IcollectionInfo';
import { send404, sendError, sendOk } from '../helper/httpMethods';

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
  router.get('/favorites', validateJWT, getFavoriteCollections);
  router.post('/favorite', validateJWT, addToFavoriteCollections);

  return router.routes();
}

async function getAllCollections(ctx: Context) {
  const username = ctx.state.username;

  let allCollections = await db.collection(username).findOne({ title: 'collectionInfo' });
  allCollections = allCollections.collectionsMeta;
  if (allCollections) {
    sendOk({ ctx, data: allCollections });
  } else {
    sendError({ ctx, errorMessage: 'Could not find the collection info bundle' });
  }
}

async function getSpecificCollection(ctx: Context) {
  const collectionName: string = ctx.query.name;
  const username = ctx.state.username;

  const specCollection = await db.collection(username).findOne({ title: collectionName });
  specCollection
    ? sendOk({
        ctx,
        data: {
          title: specCollection.title,
          configuration: specCollection.configuration,
        },
      })
    : send404({ ctx, errorMessage: 'Could not find the queried collection' });
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
  success && deletedCollection
    ? sendOk({ ctx, data: deletedCollection })
    : send404({ ctx, errorMessage: 'Could not delete the target collection or configure the meta information' });
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
            favorite: false,
            created: new Date(),
          },
        },
      }
    )
    .then(() => {
      newCollection ? sendOk({ ctx, data: newCollectionObj }) : null;
    })
    .catch(() => {
      send404({ ctx, errorMessage: 'Error while trying to create new Collection' });
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
      sendOk({ ctx, data: fitnessData });
    })
    .catch((err: MongoError) => {
      send404({ ctx, errorMessage: 'Error trying to add new fitness entry: ' + err });
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
      send404({ ctx, errorMessage: 'Didnt find the collection you were looking for' });
    });

  const updatedCollectionInfo = await db.collection(username).findOne({ 'collectionsMeta.title': targedCollectionName });
  updatedCollectionInfo.collectionsMeta.find((doc: ICollectionInfo) => (doc.title = targedCollectionName)).numberOfEntries++;

  await db
    .collection(username)
    .replaceOne({ title: 'collectionInfo' }, updatedCollectionInfo)
    .then(() => {
      sendOk({ ctx, data: ctx.request.body });
    })
    .catch(() => {
      send404({ ctx, errorMessage: 'Couldnt adjust the collection information according to input.' });
    });
}

async function getSpecificCollectionData(ctx: Context) {
  const collectionName = ctx.query.collection;
  const username = ctx.state.username;

  const targedCollection = await db.collection(username).findOne({ title: collectionName });
  targedCollection ? sendOk({ ctx, data: targedCollection.data }) : send404({ ctx, errorMessage: 'The collection you are looking for wasnt found.' });
}

async function getFavoriteCollections(ctx: Context) {
  const username = ctx.state.username;

  const cachedCollections = await db.collection(username).findOne({ title: 'Favorites' });
  cachedCollections ? sendOk({ ctx, data: cachedCollections }) : send404({ ctx, errorMessage: 'Could not find the cached collections' });
}

async function addToFavoriteCollections(ctx: Context) {
  const username = ctx.state.username;
  const collectionToAdd: ICollectionInfo = ctx.request.body;
  const collectionData: ICollectionConfig = await db.collection(username).findOne({ title: collectionToAdd.title });
  collectionToAdd.favorite = !collectionToAdd.favorite;
  const favorites = await db.collection(username).findOne({ title: 'Favorites' });
  if (!favorites) {
    const startFavorites = await db.collection(username).insertOne({ title: 'Favorites', info: [collectionToAdd], config: [collectionData] });
    startFavorites ? sendOk({ ctx, data: startFavorites.ops[0] }) : send404({ ctx, errorMessage: 'Could not create the favorites collection' });
  } else {
    toogleFavorite(username, collectionToAdd.title).catch(async () => {
      await db.collection(username).updateOne({ title: 'Favorites' }, { $push: { info: collectionToAdd, config: { data: collectionData } } });
    });
    sendOk({ ctx, data: collectionToAdd });
  }
}

async function toogleFavorite(username: string, collectionTitle: string) {
  let collectionBundle = await db.collection(username).findOne({ title: 'collectionInfo' });
  let targedIndex = collectionBundle.collectionsMeta.findIndex((col: ICollectionInfo) => col.title === collectionTitle);
  collectionBundle.collectionsMeta[targedIndex].favorite = !collectionBundle.collectionsMeta[targedIndex].favorite;
  await db.collection(username).replaceOne({ title: 'collectionInfo' }, collectionBundle);
}
