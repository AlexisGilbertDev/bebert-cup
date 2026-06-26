export const env = {
  PORT: parseInt(process.env.PORT ?? '3000', 10) || 3000,
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
};
