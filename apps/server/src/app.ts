// ./apps/server/src/app.ts
import express from "express";
import cors from "cors";
import { requestLogger } from "./middlewares/requestLogger";
import routes from "./routes";
import { globalErrorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", routes);
app.use(globalErrorHandler);
app.use(requestLogger);
export default app;
