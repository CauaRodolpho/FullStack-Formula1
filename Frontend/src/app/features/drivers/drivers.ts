import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { F1Service } from '../../core/services/f1.service';
import { DriverStanding } from '../../core/models/f1.model';

@Component({
  selector: 'app-drivers',
  standalone: true,
  templateUrl: './drivers.html',
})
export class Drivers implements OnInit {
  private f1Service = inject(F1Service);

  drivers = signal<DriverStanding[]>([]);
  selectedDriverId = signal<string | null>(null);
  searchQuery = signal('');
  loading = signal(true);
  error = signal<string | null>(null);
  brokenPhotos = signal<Record<string, boolean>>({});

  filteredDrivers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.drivers();

    return this.drivers().filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.code.toLowerCase().includes(query) ||
        d.teamName.toLowerCase().includes(query),
    );
  });

  selectedDriver = computed(() => {
    const list = this.drivers();
    const id = this.selectedDriverId();
    return list.find((d) => d.driverId === id) ?? list[0] ?? null;
  });

  teammate = computed(() => {
    const current = this.selectedDriver();
    if (!current) return null;
    return (
      this.drivers().find((d) => d.teamId === current.teamId && d.driverId !== current.driverId) ??
      null
    );
  });

  driverAge = computed(() => {
    const dob = this.selectedDriver()?.dateOfBirth;
    if (!dob) return '--';
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  });

  driverRadarPoints = computed(() => {
    const driver = this.selectedDriver();
    const total = Math.max(this.drivers().length, 20);
    if (!driver) return '';

    const rankFactor = Math.max(60, 100 - ((driver.position - 1) / total) * 35);
    const winBoost = Math.min(12, driver.wins * 2);

    const values = [
      Math.min(99, rankFactor + winBoost),
      Math.min(98, rankFactor + 3),
      Math.min(99, rankFactor + winBoost - 1),
      Math.min(96, rankFactor + 2),
      Math.min(95, 78 + (driver.position <= 5 ? 14 : 6)),
    ];

    return this.buildRadarPolygon(values);
  });

  gridAveragePolygon = this.buildRadarPolygon([76, 74, 75, 73, 75]);

  ngOnInit(): void {
    this.f1Service.getDrivers().subscribe({
      next: (res) => {
        this.drivers.set(res);
        if (res.length > 0) {
          this.selectedDriverId.set(res[0].driverId);
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar pilotos.');
        this.loading.set(false);
      },
    });
  }

  selectDriver(driverId: string): void {
    this.selectedDriverId.set(driverId);
  }

  markPhotoBroken(driverId: string): void {
    this.brokenPhotos.update((prev) => ({ ...prev, [driverId]: true }));
  }

  firstName(fullName: string): string {
    return fullName.split(' ')[0] ?? fullName;
  }

  lastName(fullName: string): string {
    const parts = fullName.split(' ');
    return parts.length > 1 ? parts.slice(1).join(' ') : fullName;
  }

  teammateShare(driverPoints: number, matePoints: number): number {
    const sum = driverPoints + matePoints;
    if (sum === 0) return 50;
    return Math.round((driverPoints / sum) * 100);
  }

  private buildRadarPolygon(values: number[]): string {
    const cx = 110;
    const cy = 95;
    const maxR = 62;

    return values
      .map((val, idx) => {
        const angle = ((-90 + idx * 72) * Math.PI) / 180;
        const r = (val / 100) * maxR;
        const x = (cx + r * Math.cos(angle)).toFixed(1);
        const y = (cy + r * Math.sin(angle)).toFixed(1);
        return `${x},${y}`;
      })
      .join(' ');
  }
}
