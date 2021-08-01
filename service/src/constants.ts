export const SERVICE_HOST = process.env.SERVICE_HOST ?? 'http://localhost'
export const SERVICE_PORT = process.env.SERVICE_PORT ?? '8000'
export const SERVICE_DOMAIN = `${SERVICE_HOST}:${SERVICE_PORT}`;
export const ORIGIN = `${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`;