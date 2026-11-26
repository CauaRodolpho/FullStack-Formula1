import "dotenv/config";

export const env = {
  port: Number(process.env.PORT) || 3333,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:4200",
  f1ApiBaseUrl: process.env.F1_API_BASE_URL || "https://api.jolpi.ca/ergast/f1",
};
