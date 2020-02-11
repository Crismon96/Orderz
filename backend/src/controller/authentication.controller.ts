import Router from 'koa-router';
import { Context } from 'koa';
import { createFitnessCollection, db } from '../shared/db.helper';
import { decryptUser, generateJWT, saltAndHashSaveUser } from '../auth/encryption.service';

export function authenticationController() {
  const router = new Router();

  router.put('/user', registerNewUser);

  router.post('/login', logUserIn);

  return router.routes();
}

async function registerNewUser(ctx: Context) {
  const { username, password, email } = ctx.request.body;
  const userDataCollection = await db.createCollection(username);
  if (userDataCollection) {
    await createFitnessCollection(username);
  }

  const user = {
    uuid: '',
    username: username,
    password: password,
    email: email,
  };

  await saltAndHashSaveUser(user, ctx);
  ctx.body = 'User was successfully registered';
  ctx.status = 200;
}

async function logUserIn(ctx: Context) {
  const { username, password } = ctx.request.body;
  const user = await decryptUser(username, password);
  if (typeof user === 'string') {
    ctx.throw(401, user);
  } else if (user) {
    generateJWT(user);

    ctx.body = user;
    ctx.status = 200;
  } else {
    ctx.throw(400, 'There was an error accessing the database');
  }
}
