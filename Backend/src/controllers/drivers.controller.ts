import { NextFunction, Request, Response } from "express";
import { f1Service } from "../services/f1.service";

export async function getDrivers(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const season =
      typeof req.query.season === "string" ? req.query.season : "current";
    const { payload, cached } = await f1Service.getDriverStandings(season);

    res.json({
      data: payload,
      meta: { season, cached, updatedAt: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
}
