import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideLayoutDashboard,
  lucideFlagTriangleRight,
  lucideUsers,
  lucideCalendarDays,
  lucideChartNoAxesCombined,
  lucideSettings,
} from '@ng-icons/lucide';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIcon],
  viewProviders: [
    provideIcons({
      lucideChevronLeft,
      lucideChevronRight,
      lucideLayoutDashboard,
      lucideFlagTriangleRight,
      lucideUsers,
      lucideCalendarDays,
      lucideChartNoAxesCombined,
      lucideSettings,
    }),
  ],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  isCollapsed = false;

  navItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'lucideLayoutDashboard' },
    { label: 'Constructors', route: '/constructors', icon: 'lucideFlagTriangleRight' },
    { label: 'Drivers', route: '/drivers', icon: 'lucideUsers' },
    { label: 'Races', route: '/races', icon: 'lucideCalendarDays' },
    { label: 'Statistics', route: '/statistics', icon: 'lucideChartNoAxesCombined' },
  ];

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
