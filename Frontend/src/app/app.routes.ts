import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Constructors } from './features/constructors/constructors';
import { Drivers } from './features/drivers/drivers';
import { Races } from './features/races/races';
import { Statistics } from './features/statistics/statistics';
import { Settings } from './features/settings/settings';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'constructors', component: Constructors },
  { path: 'drivers', component: Drivers },
  { path: 'races', component: Races },
  { path: 'statistics', component: Statistics },
  { path: 'settings', component: Settings },
];
