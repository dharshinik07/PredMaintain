import type { IncomingMessage, ServerResponse } from "http";
import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Normalize URL in case Vercel stripped /api prefix
app.use((req, _res, next) => {
  if (!req.url.startsWith("/api")) {
    req.url = "/api" + req.url;
  }
  next();
});

let initialized = false;
let initPromise: Promise<void> | null = null;

async function init() {
  if (initialized) return;
  if (!initPromise) {
    initPromise = (async () => {
      await registerRoutes(null, app);

      app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        console.error("Internal Server Error:", err);
        if (res.headersSent) return next(err);
        return res.status(status).json({ message });
      });

      initialized = true;
    })();
  }
  await initPromise;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await init();
  return (app as any)(req, res);
}
