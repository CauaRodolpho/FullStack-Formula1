import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBell } from '@ng-icons/lucide';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIcon],
  viewProviders: [provideIcons({ lucideBell })],
  templateUrl: './header.html',
})
export class Header {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  pageTitle = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute.firstChild;
        while (route?.firstChild) {
          route = route.firstChild;
        }
        return route?.snapshot.data['title'] ?? 'F1 Performance & Analytics';
      }),
    ),
    { initialValue: 'F1 Performance & Analytics' },
  );
}
