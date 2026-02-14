import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-placeholder-page',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="placeholder-page"><h1>{{ title }}</h1></div>`,
  styles: [`.placeholder-page { padding: 24px; } .placeholder-page h1 { margin: 0; font-size: 24px; color: #333; }`],
})
export class PlaceholderPageComponent implements OnInit {
  title = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.title = (this.route.snapshot.data['title'] as string) ?? 'Страница';
    this.route.data.subscribe((data) => {
      this.title = (data['title'] as string) ?? 'Страница';
    });
  }
}
