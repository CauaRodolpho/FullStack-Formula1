import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { F1Service } from '../../core/services/f1.service';
import { ConstructorStanding } from '../../core/models/f1.model';

@Component({
  selector: 'app-constructors',
  standalone: true,
  templateUrl: './constructors.html',
})
export class Constructors implements OnInit {
  private f1Service = inject(F1Service);

  constructors = signal<ConstructorStanding[]>([]);
  selectedTeamId = signal<string | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  brokenCars = signal<Record<string, boolean>>({});

  selectedTeam = computed(() => {
    const list = this.constructors();
    const id = this.selectedTeamId();
    return list.find((t) => t.teamId === id) ?? list[0] ?? null;
  });

  teamRadarPolygon = computed(() => {
    const m = this.selectedTeam()?.metrics;
    if (!m) return '';
    return this.buildRadarPolygon([m.aero, m.powerUnit, m.strategy, m.pitStops, m.reliability]);
  });

  gridRadarPolygon = this.buildRadarPolygon([82, 84, 80, 81, 83]);

  ngOnInit(): void {
    this.f1Service.getConstructors().subscribe({
      next: (res) => {
        this.constructors.set(res);
        if (res.length > 0) {
          this.selectedTeamId.set(res[0].teamId);
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar construtores.');
        this.loading.set(false);
      },
    });
  }

  selectTeam(teamId: string): void {
    this.selectedTeamId.set(teamId);
  }

  markCarBroken(teamId: string): void {
    this.brokenCars.update((prev) => ({ ...prev, [teamId]: true }));
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
