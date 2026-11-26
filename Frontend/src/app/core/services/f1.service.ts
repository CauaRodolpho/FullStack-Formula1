import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  ApiResponse,
  ConstructorStanding,
  DashboardData,
  DriverStanding,
  Race,
  StatisticsData,
} from '../models/f1.model';

@Injectable({
  providedIn: 'root',
})
export class F1Service {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3333/api/v1';

  getDashboard(season = 'current'): Observable<DashboardData> {
    return this.http
      .get<ApiResponse<DashboardData>>(`${this.apiUrl}/dashboard`, { params: { season } })
      .pipe(map((res) => res.data));
  }

  getDrivers(season = 'current'): Observable<DriverStanding[]> {
    return this.http
      .get<ApiResponse<DriverStanding[]>>(`${this.apiUrl}/drivers`, { params: { season } })
      .pipe(map((res) => res.data));
  }

  getConstructors(season = 'current'): Observable<ConstructorStanding[]> {
    return this.http
      .get<ApiResponse<ConstructorStanding[]>>(`${this.apiUrl}/constructors`, {
        params: { season },
      })
      .pipe(map((res) => res.data));
  }

  getRaces(season = 'current'): Observable<Race[]> {
    return this.http
      .get<ApiResponse<Race[]>>(`${this.apiUrl}/races`, { params: { season } })
      .pipe(map((res) => res.data));
  }

  getStatistics(season = 'current'): Observable<StatisticsData> {
    return this.http
      .get<ApiResponse<StatisticsData>>(`${this.apiUrl}/statistics`, { params: { season } })
      .pipe(map((res) => res.data));
  }
}
