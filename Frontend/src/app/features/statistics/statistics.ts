import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { F1Service } from '../../core/services/f1.service';
import { StatisticsData } from '../../core/models/f1.model';

@Component({
  selector: 'app-statistics',
  standalone: true,
  templateUrl: './statistics.html',
})
export class Statistics implements OnInit {
  private f1Service = inject(F1Service);

  stats = signal<StatisticsData | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  mostWinsDriver = computed(() => {
    const data = this.stats();
    return data?.mostWins[0] ?? data?.topDrivers[0] ?? null;
  });

  fastestLapDriver = computed(() => {
    const data = this.stats();
    return data?.topDrivers[1] ?? data?.topDrivers[0] ?? null;
  });

  pitStopDriver = computed(() => {
    const data = this.stats();
    return data?.topDrivers[2] ?? data?.topDrivers[0] ?? null;
  });

  headToHeadPairs = computed(() => {
    const teams = this.stats()?.constructorsComparison ?? [];
    return teams
      .filter((t) => t.drivers.length >= 2)
      .slice(0, 5)
      .map((team) => {
        const d1 = team.drivers[0];
        const d2 = team.drivers[1];
        const total = Math.max(d1.points + d2.points, 1);
        return {
          teamName: team.name,
          teamColor: team.color,
          d1Name: d1.name,
          d1Points: d1.points,
          d1Pct: Math.max(15, Math.round((d1.points / total) * 100)),
          d2Name: d2.name,
          d2Points: d2.points,
          d2Pct: Math.max(15, Math.round((d2.points / total) * 100)),
        };
      });
  });

  ngOnInit(): void {
    this.f1Service.getStatistics().subscribe({
      next: (res) => {
        this.stats.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar estatísticas da temporada.');
        this.loading.set(false);
      },
    });
  }
}
