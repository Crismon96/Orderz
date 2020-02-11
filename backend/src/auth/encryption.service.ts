import { db, userDB } from '../shared/db.helper';
import uuidv4 from 'uuid/v4';
import { Context } from 'koa';
import jwt from 'jsonwebtoken';

import bcrypt from 'bcryptjs';
const saltRounds = 10;

export interface IUser {
  uuid: string;
  username: string;
  password: string;
  email: string;
}

export async function saltAndHashSaveUser(user: IUser, ctx: Context): Promise<void> {
  bcrypt.hash(user.password, saltRounds, async (err: Error, hash: string) => {
    const hashedUser = {
      ...user,
      uuid: uuidv4(),
      password: hash,
    };
    await db
      .collection(user.username)
      .insertOne(hashedUser)
      .then(async () => {
        await userDB
          .collection('userCredentials')
          .insertOne(hashedUser)
          .catch(() => {
            ctx.throw(400, 'Error, while saving newUser to database.');
          });
      });
  });
}

export async function decryptUser(username: string, password: string): Promise<IUser | string> {
  const selectedUser = await userDB.collection('userCredentials').findOne({ username: username });
  if (!selectedUser) {
    return 'Username not correct';
  }
  const comparison = await bcrypt.compare(password, selectedUser.password);
  if (comparison) {
    return selectedUser;
  } else {
    return 'False Password entered';
  }
}

export async function generateJWT(user: IUser) {
  //TODO: renew expirationDAte on database upon login.
  const expirationDate = new Date().getTime() + 1000 * 60 * 60 * 24 * 7;
  const token = jwt.sign({ username: user.username, email: user.email, expirationDate: expirationDate }, process.env['JWT_SECRET']);
}