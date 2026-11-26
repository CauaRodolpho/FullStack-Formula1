export interface TeamMetadata {
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
}

const TEAMS_METADATA: Record<string, TeamMetadata> = {
  red_bull: {
    color: "#3671C6",
    base: "Milton Keynes, UK",
    chassis: "RB22",
    powerUnit: "Red Bull Ford",
    principal: "Laurent Mekies",
    worldTitles: 6,
    carImage: "/cars/red_bull.png",
    metrics: {
      aero: 92,
      powerUnit: 89,
      strategy: 94,
      pitStops: 96,
      reliability: 90,
    },
  },
  ferrari: {
    color: "#E10600",
    base: "Maranello, Italy",
    chassis: "SF-26",
    powerUnit: "Ferrari",
    principal: "Frédéric Vasseur",
    worldTitles: 16,
    carImage: "/cars/ferrari.png",
    metrics: {
      aero: 91,
      powerUnit: 93,
      strategy: 86,
      pitStops: 90,
      reliability: 91,
    },
  },
  mercedes: {
    color: "#00D2BE",
    base: "Brackley, UK",
    chassis: "W17",
    powerUnit: "Mercedes",
    principal: "Toto Wolff",
    worldTitles: 8,
    carImage: "/cars/mercedes.png",
    metrics: {
      aero: 90,
      powerUnit: 94,
      strategy: 91,
      pitStops: 89,
      reliability: 93,
    },
  },
  mclaren: {
    color: "#FF8000",
    base: "Woking, UK",
    chassis: "MCL40",
    powerUnit: "Mercedes",
    principal: "Andrea Stella",
    worldTitles: 9,
    carImage: "/cars/mclaren.png",
    metrics: {
      aero: 95,
      powerUnit: 94,
      strategy: 90,
      pitStops: 92,
      reliability: 94,
    },
  },
  aston_martin: {
    color: "#229971",
    base: "Silverstone, UK",
    chassis: "AMR26",
    powerUnit: "Honda",
    principal: "Andy Cowell",
    worldTitles: 0,
    carImage: "/cars/aston_martin.png",
    metrics: {
      aero: 86,
      powerUnit: 87,
      strategy: 84,
      pitStops: 85,
      reliability: 88,
    },
  },
  alpine: {
    color: "#FF87BC",
    base: "Enstone, UK",
    chassis: "A526",
    powerUnit: "Mercedes",
    principal: "Oliver Oakes",
    worldTitles: 2,
    carImage: "/cars/alpine.png",
    metrics: {
      aero: 80,
      powerUnit: 88,
      strategy: 81,
      pitStops: 82,
      reliability: 84,
    },
  },
  williams: {
    color: "#64C4FF",
    base: "Grove, UK",
    chassis: "FW48",
    powerUnit: "Mercedes",
    principal: "James Vowles",
    worldTitles: 9,
    carImage: "/cars/williams.png",
    metrics: {
      aero: 83,
      powerUnit: 88,
      strategy: 85,
      pitStops: 84,
      reliability: 86,
    },
  },
  rb: {
    color: "#6692FF",
    base: "Faenza, Italy",
    chassis: "VCARB 03",
    powerUnit: "Red Bull Ford",
    principal: "Alan Permane",
    worldTitles: 0,
    carImage: "/cars/rb.png",
    metrics: {
      aero: 82,
      powerUnit: 87,
      strategy: 80,
      pitStops: 83,
      reliability: 85,
    },
  },
  audi: {
    color: "#F50537",
    base: "Hinwil, Switzerland",
    chassis: "R26",
    powerUnit: "Audi",
    principal: "Mattia Binotto",
    worldTitles: 0,
    carImage: "/cars/audi.png",
    metrics: {
      aero: 79,
      powerUnit: 81,
      strategy: 82,
      pitStops: 80,
      reliability: 80,
    },
  },
  sauber: {
    color: "#52E252",
    base: "Hinwil, Switzerland",
    chassis: "C46",
    powerUnit: "Ferrari",
    principal: "Mattia Binotto",
    worldTitles: 0,
    carImage: "/cars/sauber.png",
    metrics: {
      aero: 78,
      powerUnit: 85,
      strategy: 80,
      pitStops: 79,
      reliability: 82,
    },
  },
  haas: {
    color: "#B6BABD",
    base: "Kannapolis, USA",
    chassis: "VF-26",
    powerUnit: "Ferrari",
    principal: "Ayao Komatsu",
    worldTitles: 0,
    carImage: "/cars/haas.png",
    metrics: {
      aero: 81,
      powerUnit: 86,
      strategy: 83,
      pitStops: 81,
      reliability: 85,
    },
  },
  cadillac: {
    color: "#D4AF37",
    base: "Fishers, USA",
    chassis: "CAD-01",
    powerUnit: "Ferrari",
    principal: "Graeme Lowdon",
    worldTitles: 0,
    carImage: "/cars/cadillac.png",
    metrics: {
      aero: 76,
      powerUnit: 85,
      strategy: 79,
      pitStops: 78,
      reliability: 80,
    },
  },
};

export function getTeamMetadata(constructorId: string): TeamMetadata {
  return (
    TEAMS_METADATA[constructorId] ?? {
      color: "#94A3B8",
      base: "Unknown",
      chassis: "F1-26",
      powerUnit: "Unknown",
      principal: "Team Principal",
      worldTitles: 0,
      carImage: "/cars/default.png",
      metrics: {
        aero: 80,
        powerUnit: 80,
        strategy: 80,
        pitStops: 80,
        reliability: 80,
      },
    }
  );
}
