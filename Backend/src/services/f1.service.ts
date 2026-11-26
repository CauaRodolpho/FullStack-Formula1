import { env } from "../config/env";
import { getTeamMetadata } from "../config/teams.config";
import { AppError } from "../middlewares/error.middleware";
import {
  ConstructorStandingDTO,
  DashboardDTO,
  DriverStandingDTO,
  RaceDTO,
  StatisticsDTO,
} from "../types/f1.types";
import { cacheService } from "./cache.service";

interface ServiceResult<T> {
  payload: T;
  cached: boolean;
}

class F1Service {
  private async fetchFromJolpica(path: string): Promise<any> {
    const response = await fetch(`${env.f1ApiBaseUrl}${path}`);

    if (!response.ok) {
      throw new AppError(
        `Jolpica API error: ${response.statusText}`,
        response.status,
      );
    }

    return response.json();
  }

  private async getDriverHeadshotsMap(): Promise<Record<string, string>> {
    const cacheKey = "openf1:headshots";
    const cached = cacheService.get<Record<string, string>>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        "https://api.openf1.org/v1/drivers?session_key=latest",
      );
      if (!response.ok) return {};

      const list: any[] = await response.json();
      const map: Record<string, string> = {};

      for (const item of list) {
        if (item.name_acronym && item.headshot_url) {
          // Aumenta a resolução do recorte oficial da F1 quando disponível
          map[item.name_acronym.toUpperCase()] = item.headshot_url.replace(
            "1col",
            "4col",
          );
        }
      }

      cacheService.set(cacheKey, map, 86400); // Cache de 24h
      return map;
    } catch {
      return {};
    }
  }

  async getDriverStandings(
    season = "current",
  ): Promise<ServiceResult<DriverStandingDTO[]>> {
    const cacheKey = `drivers:${season}`;
    const cachedData = cacheService.get<DriverStandingDTO[]>(cacheKey);
    if (cachedData) return { payload: cachedData, cached: true };

    const [raw, headshots] = await Promise.all([
      this.fetchFromJolpica(`/${season}/driverStandings.json`),
      this.getDriverHeadshotsMap(),
    ]);

    const list =
      raw?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];

    const payload: DriverStandingDTO[] = list.map((item: any) => {
      const constructor = item.Constructors?.[0];
      const teamId = constructor?.constructorId ?? "unknown";
      const meta = getTeamMetadata(teamId);
      const code = (
        item.Driver.code ?? item.Driver.familyName.slice(0, 3)
      ).toUpperCase();

      return {
        position: Number(item.position),
        driverId: item.Driver.driverId,
        code,
        number: item.Driver.permanentNumber ?? "-",
        name: `${item.Driver.givenName} ${item.Driver.familyName}`,
        nationality: item.Driver.nationality,
        dateOfBirth: item.Driver.dateOfBirth ?? null,
        photoUrl: headshots[code] ?? null,
        teamId,
        teamName: constructor?.name ?? "Unknown",
        teamColor: meta.color,
        wins: Number(item.wins),
        points: Number(item.points),
      };
    });

    cacheService.set(cacheKey, payload, 900);
    return { payload, cached: false };
  }

  async getConstructorStandings(
    season = "current",
  ): Promise<ServiceResult<ConstructorStandingDTO[]>> {
    const cacheKey = `constructors:${season}`;
    const cachedData = cacheService.get<ConstructorStandingDTO[]>(cacheKey);
    if (cachedData) return { payload: cachedData, cached: true };

    const [raw, { payload: drivers }] = await Promise.all([
      this.fetchFromJolpica(`/${season}/constructorStandings.json`),
      this.getDriverStandings(season),
    ]);

    const list =
      raw?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ??
      [];

    const payload: ConstructorStandingDTO[] = list.map((item: any) => {
      const teamId = item.Constructor.constructorId;
      const meta = getTeamMetadata(teamId);
      const teamDrivers = drivers
        .filter((d) => d.teamId === teamId)
        .map((d) => ({
          code: d.code,
          name: d.name,
          number: d.number,
          points: d.points,
          photoUrl: d.photoUrl,
        }));

      return {
        position: Number(item.position),
        teamId,
        name: item.Constructor.name,
        nationality: item.Constructor.nationality,
        color: meta.color,
        base: meta.base,
        chassis: meta.chassis,
        powerUnit: meta.powerUnit,
        principal: meta.principal,
        worldTitles: meta.worldTitles,
        carImage: meta.carImage,
        metrics: meta.metrics,
        wins: Number(item.wins),
        points: Number(item.points),
        drivers: teamDrivers,
      };
    });

    cacheService.set(cacheKey, payload, 900);
    return { payload, cached: false };
  }

  async getRaces(season = "current"): Promise<ServiceResult<RaceDTO[]>> {
    const cacheKey = `races:${season}`;
    const cachedData = cacheService.get<RaceDTO[]>(cacheKey);
    if (cachedData) return { payload: cachedData, cached: true };

    const raw = await this.fetchFromJolpica(`/${season}.json`);
    const races = raw?.MRData?.RaceTable?.Races ?? [];
    const today = new Date().toISOString().split("T")[0];
    let nextAssigned = false;

    const payload: RaceDTO[] = races.map((race: any) => {
      let status: RaceDTO["status"] = "upcoming";

      if (race.date < today) {
        status = "completed";
      } else if (!nextAssigned) {
        status = "next";
        nextAssigned = true;
      }

      return {
        round: Number(race.round),
        raceName: race.raceName,
        circuitId: race.Circuit.circuitId,
        circuitName: race.Circuit.circuitName,
        locality: race.Circuit.Location.locality,
        country: race.Circuit.Location.country,
        date: race.date,
        time: race.time ?? null,
        status,
      };
    });

    cacheService.set(cacheKey, payload, 3600);
    return { payload, cached: false };
  }

  async getDashboard(season = "current"): Promise<ServiceResult<DashboardDTO>> {
    const cacheKey = `dashboard:${season}`;
    const cachedData = cacheService.get<DashboardDTO>(cacheKey);
    if (cachedData) return { payload: cachedData, cached: true };

    const [
      { payload: drivers },
      { payload: constructors },
      { payload: races },
    ] = await Promise.all([
      this.getDriverStandings(season),
      this.getConstructorStandings(season),
      this.getRaces(season),
    ]);

    const nextRace =
      races.find((r) => r.status === "next") ?? races[races.length - 1] ?? null;

    const payload: DashboardDTO = {
      driverLeader: drivers[0] ?? null,
      constructorLeader: constructors[0] ?? null,
      nextRace,
      standings: drivers.slice(0, 8),
      constructorsTop: constructors.slice(0, 5),
    };

    cacheService.set(cacheKey, payload, 600);
    return { payload, cached: false };
  }

  async getStatistics(
    season = "current",
  ): Promise<ServiceResult<StatisticsDTO>> {
    const cacheKey = `statistics:${season}`;
    const cachedData = cacheService.get<StatisticsDTO>(cacheKey);
    if (cachedData) return { payload: cachedData, cached: true };

    const [
      { payload: drivers },
      { payload: constructors },
      { payload: races },
    ] = await Promise.all([
      this.getDriverStandings(season),
      this.getConstructorStandings(season),
      this.getRaces(season),
    ]);

    const mostWins = [...drivers]
      .filter((d) => d.wins > 0)
      .sort((a, b) => b.wins - a.wins)
      .slice(0, 5);

    const payload: StatisticsDTO = {
      totalRaces: races.length,
      completedRaces: races.filter((r) => r.status === "completed").length,
      mostWins,
      topDrivers: drivers.slice(0, 5),
      constructorsComparison: constructors,
    };

    cacheService.set(cacheKey, payload, 900);
    return { payload, cached: false };
  }
}

export const f1Service = new F1Service();
