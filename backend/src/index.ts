import { Hono } from 'hono'
import { cors } from 'hono/cors'
import profiles from './routes'

const app = new Hono()
app.use(cors())

app.route('/profiles',profiles)

export default app
