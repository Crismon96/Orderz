import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaStatic from 'koa-static';
import path from 'path';
import mount from 'koa-mount';
import { collectionController } from './controller/collection.controller';
import { authenticationController } from './controller/authentication.controller';
import { MongoNetworkError } from 'mongodb';
import { connect } from './shared/db.helper';

async function startApp() {
  const app = new Koa();
  // Serve static HTML files (our frontend) - only used in production
  const assetPath = path.join(__dirname, '../frontend');
  console.log(`Serving static files from ${assetPath}`);
  app.use(koaStatic(assetPath));

  // Serve API
  app.use(bodyParser());

  app.use(mount('/api/auth', authenticationController()));
  app.use(mount('/api/collections', collectionController()));

  // Start server
  if (process.env.NODE_ENV !== 'test') {
    app.listen(3000, () => {
      console.log(`Backend listening at http://localhost:3000/`);
    });
  }
  await connect();
}

startApp().catch(err => {
  if (err instanceof MongoNetworkError) {
    console.error(`connection to database failed: ${err.message}`);
  } else {
    console.error(`error at server startup: ${err.message}`);
  }
});
