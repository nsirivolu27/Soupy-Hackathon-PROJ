import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { router } from "./routes.js";

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(helmet());
app.use(cors({ origin: process.env.WEB_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "50kb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, name: "soupy-api" });
});

app.use("/api", router);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(400).json({
    error: "Something went wrong. Please try again or start over."
  });
});

app.listen(port, () => {
  console.log(`Soupy API listening on http://localhost:${port}`);
});
