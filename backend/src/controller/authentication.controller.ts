import Router from 'koa-router';
import { Context } from 'koa';
import { createFitnessCollection, db } from '../shared/db.helper';

export function authenticationController() {
  const router = new Router();

  router.put('/user', registerNewUser);

  return router.routes();
}

async function registerNewUser(ctx: Context) {
  const { username, password, email } = ctx.request.body;
  const userCollection = await db.createCollection('username');
  if (userCollection) {
    await createFitnessCollection('username');
  }
}
