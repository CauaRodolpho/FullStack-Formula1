import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { router } from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.use("/api/v1", router);

app.use(errorMiddleware);

export { app };
