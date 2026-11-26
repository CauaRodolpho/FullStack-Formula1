import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller";
import { getDrivers } from "../controllers/drivers.controller";
import { getConstructors } from "../controllers/constructors.controller";
import { getRaces } from "../controllers/races.controller";
import { getStatistics } from "../controllers/statistics.controller";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    name: "ApexMetrics F1 API",
    version: "1.0.0",
    endpoints: [
      "/health",
      "/dashboard",
      "/drivers",
      "/constructors",
      "/races",
      "/statistics",
    ],
  });
});

router.get("/health", (_req, res) => {
  res.json({
    status: "online",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

router.get("/dashboard", getDashboard);
router.get("/drivers", getDrivers);
router.get("/constructors", getConstructors);
router.get("/races", getRaces);
router.get("/statistics", getStatistics);

export { router };
