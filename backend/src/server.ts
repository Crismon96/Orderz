import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import koaStatic from 'koa-static'
import path from 'path'
import mount from 'koa-mount'

const app = new Koa()

// Serve static HTML files (our frontend) - only used in production
const assetPath = path.join(__dirname, '../frontend')
console.log(`Serving static files from ${assetPath}`)
app.use(koaStatic(assetPath))

// Serve API
app.use(bodyParser())

/*app.use(mount('/api/auth', authenticationController()));
app.use(mount('/api/categories', categoriesController()));*/

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => {
    console.log(`Backend listening at http://localhost:3000/`)
  })
}

export default app
