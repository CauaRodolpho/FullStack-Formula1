import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './shared/components/sidebar/sidebar';
import { Header } from './shared/components/header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Header],
  templateUrl: './app.html',
})
export class App {}
