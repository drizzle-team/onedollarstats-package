import { Component } from '@angular/core';
import { event } from 'onedollarstats';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {
  trackEvent() {
    event('click', '/custom-path', { label: 'Track Event' });
  }
}
