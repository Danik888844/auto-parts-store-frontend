import {Component, OnInit} from '@angular/core';
import { RouterOutlet} from "@angular/router";
import {NavigationLinksComponent} from "./navigation-links.component";
import { NavigationSecondaryLinksComponent } from './navigation-secondary-links.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NavigationLinksComponent,
    NavigationSecondaryLinksComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}
