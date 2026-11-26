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
import { Race } from '../../core/models/f1.model';

interface CircuitSpecs {
  length: string;
  laps: number;
  lapRecord: string;
  drsZones: number;
}

const CIRCUIT_SPECS: Record<string, CircuitSpecs> = {
  interlagos: { length: '4.309 km', laps: 71, lapRecord: '1:10.540', drsZones: 2 },
  vegas: { length: '6.201 km', laps: 50, lapRecord: '1:35.490', drsZones: 2 },
  losail: { length: '5.419 km', laps: 57, lapRecord: '1:24.319', drsZones: 1 },
  yas_marina: { length: '5.281 km', laps: 58, lapRecord: '1:26.103', drsZones: 2 },
  monza: { length: '5.793 km', laps: 53, lapRecord: '1:21.046', drsZones: 2 },
  silverstone: { length: '5.891 km', laps: 52, lapRecord: '1:27.097', drsZones: 2 },
  spa: { length: '7.004 km', laps: 44, lapRecord: '1:46.286', drsZones: 2 },
  monaco: { length: '3.337 km', laps: 78, lapRecord: '1:12.909', drsZones: 1 },
  suzuka: { length: '5.807 km', laps: 53, lapRecord: '1:30.983', drsZones: 1 },
  albert_park: { length: '5.278 km', laps: 58, lapRecord: '1:19.813', drsZones: 4 },
};

@Component({
  selector: 'app-races',
  standalone: true,
  templateUrl: './races.html',
})
export class Races implements OnInit {
  private f1Service = inject(F1Service);
  private destroyRef = inject(DestroyRef);

  races = signal<Race[]>([]);
  selectedRound = signal<number | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  countdown = signal('00:00:00');

  selectedRace = computed(() => {
    const list = this.races();
    const round = this.selectedRound();
    return (
      list.find((r) => r.round === round) ??
      list.find((r) => r.status === 'next') ??
      list[0] ??
      null
    );
  });

  currentSpecs = computed<CircuitSpecs>(() => {
    const circuitId = this.selectedRace()?.circuitId ?? '';
    return (
      CIRCUIT_SPECS[circuitId] ?? {
        length: '5.412 km',
        laps: 57,
        lapRecord: '1:31.447',
        drsZones: 2,
      }
    );
  });

  weekendSchedule = computed(() => {
    const race = this.selectedRace();
    const baseTime = race?.time ? race.time.slice(0, 5) : '17:00';
    return [
      { session: 'Treinos Livres P1', time: '09:30:00' },
      { session: 'Treinos Livres P2', time: '13:00:00' },
      { session: 'Treinos Livres P3', time: '10:30:00' },
      { session: 'Classificação', time: '14:00:00' },
      { session: 'Corrida Principal', time: `${baseTime}:00` },
    ];
  });

  constructor() {
    afterNextRender(() => {
      const timer = setInterval(() => this.updateCountdown(), 1000);
      this.destroyRef.onDestroy(() => clearInterval(timer));
    });
  }

  ngOnInit(): void {
    this.f1Service.getRaces().subscribe({
      next: (res) => {
        this.races.set(res);
        const next = res.find((r) => r.status === 'next') ?? res[0];
        if (next) {
          this.selectedRound.set(next.round);
        }
        this.updateCountdown();
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar calendário de corridas.');
        this.loading.set(false);
      },
    });
  }

  selectRace(round: number): void {
    this.selectedRound.set(round);
    this.updateCountdown();
  }

  private updateCountdown(): void {
    const race = this.selectedRace();
    if (!race) return;

    const targetIso = `${race.date}T${race.time ?? '17:00:00Z'}`;
    const diff = new Date(targetIso).getTime() - Date.now();

    if (diff <= 0) {
      this.countdown.set(race.status === 'completed' ? 'COMPLETED' : 'LIVE NOW');
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
