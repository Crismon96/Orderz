import Router from 'koa-router'
import { Context } from 'koa'
import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://localhost:27017'
// Database Name
const dbName = 'Orderz'
// Create a new MongoClient
const client = new MongoClient(url)
let db: any
let fitnessCollection: any

// Use connect method to connect to the Server
client.connect(function(err) {
  console.log('Connected successfully to server')

  db = client.db(dbName)
  fitnessCollection = db.collection('documents')

  client.close().then(() => {
    console.log('Connected to Mongo Client')
  })
})

export function collectionController() {
  const router = new Router()

  router.get('', getAllCollections)
  router.post('/create', createNewCollection)

  return router.routes()
}

export async function getAllCollections(ctx: Context) {
  console.log('API WORKS')
  ctx.status = 200
  ctx.body = 'success'
}

export async function createNewCollection(ctx: Context) {
  console.log('create the new Collections')
  fitnessCollection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }])
  ctx.body = 'success'
  ctx.status = 200
}
