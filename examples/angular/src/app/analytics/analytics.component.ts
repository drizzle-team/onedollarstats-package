import { Component, OnInit } from '@angular/core';
import { configure } from 'onedollarstats';

@Component({
  selector: 'app-analytics',
  template: '', // not render anything
})
export class AnalyticsComponent implements OnInit {
  ngOnInit(): void {
    console.log('AnalyticsComponent initialized');

    configure({ hostname: 'example.com', devmode: true });
  }
}
