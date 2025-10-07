import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { Page2Component } from './page2/page2.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },  
  {
    path: 'page-2',
    component: Page2Component,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
