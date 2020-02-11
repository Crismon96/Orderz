import { db, userDB } from '../shared/db.helper';
import uuidv4 from 'uuid/v4';
import { Context } from 'koa';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const saltRounds = 10;

export interface IToken {
  username: string;
  email: string;
  expirationDate: number;
}

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

export async function generateJWT(user: IUser): Promise<string> {
  const expirationDate = await checkJWTexpirationDate();

  //TODO: Store real secret in .env
  return jwt.sign({ username: user.username, email: user.email, expirationDate: expirationDate }, 'secret');
}

async function checkJWTexpirationDate(): Promise<number> {
  const timestamp = new Date().getTime();
  const currentExpirationDate = userDB.collection('serverConfig').findOne({ expirationDate: { $exists: true } }).expirationDate;
  if (currentExpirationDate < timestamp) {
    await userDB.collection('serverConfig').updateOne({ expirationDate: { $exists: true } }, { expirationDate: timestamp });
    return timestamp;
  } else {
    return currentExpirationDate;
  }
}

function getToken(ctx: Context): string | null {
  const authHeader = ctx.headers.authorization;

  if (!authHeader) {
    return ctx.throw(401);
  }

  return authHeader.slice(7); // 'Bearer '+ tkn
}

export async function validateJWT(ctx: Context, next: () => Promise<any>) {
  const encodedToken = getToken(ctx);

  let decodedToken;
  if (encodedToken) {
    try {
      //TODO: use real secret
      decodedToken = jwt.verify(encodedToken, 'secret') as IToken;
    } catch {
      ctx.throw(401, 'Token is not valid');
    }

    const { username, email, expirationDate } = decodedToken;
    console.log('THE TOKEN WAS READ: ', decodedToken);
    if (expirationDate < new Date().getTime()) {
      ctx.throw(401, 'No valid timestamp on token');
    }

    const userRegistered = userDB.collectionNames(username);
    if (userRegistered) {
      return next();
    }
  }
}
