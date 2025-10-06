import { Component } from '@angular/core';
import { event } from 'onedollarstats';

@Component({
  selector: 'app-page2',
  templateUrl: './page2.component.html',
  styleUrls: ['./page2.component.css'],
})
export class Page2Component {
  trackEvent() {
    event('click-2', '/custom-path-2', { label: 'Track Event 2' });
  }
}
