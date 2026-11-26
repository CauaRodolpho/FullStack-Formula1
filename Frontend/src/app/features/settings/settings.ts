import { Component, OnInit, afterNextRender, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.html',
})
export class Settings implements OnInit {
  private http = inject(HttpClient);

  userName = signal('Cauã Rodolpho');
  userRole = signal('Developer');
  editingProfile = signal(false);

  darkMode = signal(true);
  telemetrySound = signal(false);
  liveNotifications = signal(true);
  language = signal('Português - BR');
  speedUnit = signal('km/h');

  fontSize = signal(70);
  dashboardRefresh = signal(60);
  colorContrast = signal(65);

  refreshRate = signal<'5s' | '10s' | '30s'>('10s');
  favoriteTeam = signal('Red Bull Racing');
  favoriteDriver = signal('Max Verstappen');

  apiConnected = signal(false);
  apiLatency = signal<number | null>(null);
  lastSync = signal('');
  savedMessage = signal(false);

  constructor() {
    afterNextRender(() => {
      const saved = localStorage.getItem('apexmetrics_settings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.userName) this.userName.set(parsed.userName);
          if (parsed.userRole) this.userRole.set(parsed.userRole);
          if (parsed.language) this.language.set(parsed.language);
          if (parsed.speedUnit) this.speedUnit.set(parsed.speedUnit);
          if (parsed.refreshRate) this.refreshRate.set(parsed.refreshRate);
          if (parsed.favoriteTeam) this.favoriteTeam.set(parsed.favoriteTeam);
          if (parsed.favoriteDriver) this.favoriteDriver.set(parsed.favoriteDriver);
        } catch {}
      }
    });
  }

  ngOnInit(): void {
    this.testConnection();
  }

  testConnection(): void {
    const start = performance.now();
    this.http.get('http://localhost:3333/api/v1/health').subscribe({
      next: () => {
        this.apiConnected.set(true);
        this.apiLatency.set(Math.max(1, Math.round(performance.now() - start)));
        this.lastSync.set(new Date().toLocaleTimeString('pt-BR'));
      },
      error: () => {
        this.apiConnected.set(false);
        this.apiLatency.set(null);
        this.lastSync.set(new Date().toLocaleTimeString('pt-BR'));
      },
    });
  }

  saveSettings(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'apexmetrics_settings',
        JSON.stringify({
          userName: this.userName(),
          userRole: this.userRole(),
          language: this.language(),
          speedUnit: this.speedUnit(),
          refreshRate: this.refreshRate(),
          favoriteTeam: this.favoriteTeam(),
          favoriteDriver: this.favoriteDriver(),
        }),
      );
    }
    this.savedMessage.set(true);
    setTimeout(() => this.savedMessage.set(false), 3000);
  }
}
