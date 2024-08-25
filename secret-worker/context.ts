type Env = {
    DB: D1Database,
    ENVIRONMENT: string
}

type Variables = {}

export type Context = {
    Bindings: Env,
    Variables: Variables
}