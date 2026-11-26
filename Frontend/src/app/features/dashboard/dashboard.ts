import {
  Component,
  DestroyRef,
  OnInit,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { F1Service } from '../../core/services/f1.service';
import { DashboardData } from '../../core/models/f1.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private f1Service = inject(F1Service);
  private destroyRef = inject(DestroyRef);

  data = signal<DashboardData | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  countdown = signal('00:00:00');
  hideLeaderPhoto = signal(false);

  maxTeamPoints = computed(() => {
    const list = this.data()?.constructorsTop ?? [];
    return list.length > 0 ? Math.max(...list.map((t) => t.points), 1) : 1;
  });

  constructor() {
    afterNextRender(() => {
      const timer = setInterval(() => this.updateCountdown(), 1000);
      this.destroyRef.onDestroy(() => clearInterval(timer));
    });
  }

  ngOnInit(): void {
    this.f1Service.getDashboard().subscribe({
      next: (res) => {
        this.data.set(res);
        this.updateCountdown();
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível conectar ao servidor da API.');
        this.loading.set(false);
      },
    });
  }

  private updateCountdown(): void {
    const race = this.data()?.nextRace;
    if (!race) return;

    const targetIso = `${race.date}T${race.time ?? '17:00:00Z'}`;
    const diff = new Date(targetIso).getTime() - Date.now();

    if (diff <= 0) {
      this.countdown.set('LIVE NOW');
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const pad = (n: number) => String(n).padStart(2, '0');
    this.countdown.set(
      days > 0
        ? `${days}D ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
        : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
    );
  }
}
