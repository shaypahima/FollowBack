import { Hono } from 'hono'
import { cors } from 'hono/cors'
import profiles from './routes'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import 'dotenv/config'


const PORT = process.env.PORT || 3000
const ENV = process.env.NODE_ENV || 'development'
const HOST = process.env.HOST || '0.0.0.0'

console.log(`Server is running on ${HOST}:${PORT} in ${ENV} mode`)

const app = new Hono()
app.use(cors())
app.use(logger())

app.route('/profiles',profiles)

export default {
  host: HOST,
  port: PORT,
  prettyJSON: prettyJSON(),
  logger: logger(),
  fetch: app.fetch,
}
