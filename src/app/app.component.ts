import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <app-menu></app-menu>
    <router-outlet></router-outlet>
   <app-footer></app-footer>
  `,
  styles: []
})

export class AppComponent {title = 'Portal agenda-esporte Sistemas';}


