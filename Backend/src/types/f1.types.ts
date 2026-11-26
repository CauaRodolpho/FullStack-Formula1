export interface DriverStandingDTO {
  position: number;
  driverId: string;
  code: string;
  number: string;
  name: string;
  nationality: string;
  dateOfBirth: string | null;
  photoUrl: string | null;
  teamId: string;
  teamName: string;
  teamColor: string;
  wins: number;
  points: number;
}

export interface ConstructorStandingDTO {
  position: number;
  teamId: string;
  name: string;
  nationality: string;
  color: string;
  base: string;
  chassis: string;
  powerUnit: string;
  principal: string;
  worldTitles: number;
  carImage: string;
  metrics: {
    aero: number;
    powerUnit: number;
    strategy: number;
    pitStops: number;
    reliability: number;
  };
  wins: number;
  points: number;
  drivers: {
    code: string;
    name: string;
    number: string;
    points: number;
    photoUrl: string | null;
  }[];
}

export interface RaceDTO {
  round: number;
  raceName: string;
  circuitId: string;
  circuitName: string;
  locality: string;
  country: string;
  date: string;
  time: string | null;
  status: "completed" | "next" | "upcoming";
}

export interface DashboardDTO {
  driverLeader: DriverStandingDTO | null;
  constructorLeader: ConstructorStandingDTO | null;
  nextRace: RaceDTO | null;
  standings: DriverStandingDTO[];
  constructorsTop: ConstructorStandingDTO[];
}

export interface StatisticsDTO {
  totalRaces: number;
  completedRaces: number;
  mostWins: DriverStandingDTO[];
  topDrivers: DriverStandingDTO[];
  constructorsComparison: ConstructorStandingDTO[];
}
