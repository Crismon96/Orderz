import Router from 'koa-router';
import { Context } from 'koa';
import { createFitnessCollection, db } from '../shared/db.helper';
import uuidv4 from 'uuid/v4';

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
  await db
    .collection('username')
    .insertOne({
      title: 'userInfo',
      uuid: uuidv4(),
      username: username,
      password: password,
      email: email,
    })
    .then(async () => {
      await db
        .collection('userInfoBundle')
        .insertOne({
          uuid: uuidv4(),
          username: username,
          password: password,
          email: email,
        })
        .then(() => {
          ctx.body = 'User was successfully registered';
          ctx.status = 200;
        })
        .catch(() => {
          ctx.body = 'Error, user was not registered';
          ctx.status = 400;
        });
    });
}
