import { Component, OnInit } from '@angular/core';
import { configure } from 'onedollarstats';

@Component({
  selector: 'app-analytics',
  template: '', // ничего не рендерим
})
export class AnalyticsComponent implements OnInit {
  ngOnInit(): void {
    console.log("AnalyticsComponent initialized");
    
    configure({
      trackLocalhostAs: 'test.com',
    });
  }
}
