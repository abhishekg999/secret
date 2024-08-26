import { Hono } from 'hono'
import { Context } from '../context'
import { drizzle } from 'drizzle-orm/d1';
import { requestSecretSchema, secrets } from './db/schema';
import { createSecretId } from './lib/utils';
import { eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';

const UUID_REGEX = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";

const app = new Hono<Context>()
app.use(logger())

const api = new Hono<Context>();

api.post(`/secret/:id{${UUID_REGEX}}`, async (c) => {
  const { id } = c.req.param();
  const db = drizzle(c.env.DB);
  const result = await db.delete(secrets).where(eq(secrets.id, id)).returning();
  if (result.length === 0) {
    return c.notFound();
  }
  return c.json({ ...result[0], timestamp: undefined }, 200);
});

api.post('secret/new', zValidator('json', requestSecretSchema), async (c) => {
  const { data } = c.req.valid("json");
  const db = drizzle(c.env.DB);
  const result = await db.insert(secrets).values({
    id: createSecretId(crypto),
    data: data,
    timestamp: new Date().getTime()
  }).returning()

  if (result.length === 0) {
    throw new HTTPException(500, { message: 'Unable to create secret.' })
  }
  return c.json(result[0], 201);
});

app.route('/api', api);
export default app;
