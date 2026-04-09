import { Hono } from 'hono'
import { Context } from '../context'
import { drizzle } from 'drizzle-orm/d1';
import { requestSecretSchema, secrets } from './db/schema';
import { createSecretId } from './lib/utils';
import { eq, lt } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

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

export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledEvent, env: { DB: D1Database }, ctx: ExecutionContext) {
    const db = drizzle(env.DB);
    const cutoff = Date.now() - ONE_DAY_MS;
    const result = await db.delete(secrets).where(lt(secrets.timestamp, cutoff)).returning({ id: secrets.id });
    console.log(`Expired ${result.length} secrets`);
  }
};
