import Router from 'koa-router'
import { Context } from 'koa'

export function collectionController() {
  const router = new Router()

  router.get('', getAllCollections)

  return router.routes()
}

export async function getAllCollections(ctx: Context) {
  console.log('API WORKS')
  ctx.status = 200
  ctx.body = 'success'
}
