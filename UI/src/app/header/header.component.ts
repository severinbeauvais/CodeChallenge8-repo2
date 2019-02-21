import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router, NavigationEnd } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { ApiService } from 'app/services/api';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('toggleNav', [
      state('navClosed', style({
        height: '0',
      })),
      state('navOpen', style({
        height: '*',
      })),
      transition('navOpen => navClosed', [
        animate('0.2s')
      ]),
      transition('navClosed => navOpen', [
        animate('0.2s')
      ]),
    ]),
  ]
})

export class HeaderComponent {
  public isNavMenuOpen = false;
  public isLoggedIn = !environment.KeycloakEnabled;

  constructor(
    private router: Router,
    private keycloakService: KeycloakService,
    private api: ApiService
  ) {
    if (environment.KeycloakEnabled) {
      this.router.events.subscribe((e: any) => {
        // on every Navigation End event, update logged in status
        if (e instanceof NavigationEnd) {
          this.keycloakService.isLoggedIn().then(value => this.isLoggedIn = value);
        }
      });
    }
  }

  public logout() {
    // clear API login variables
    this.api.logout();

    // perform logout (or appear to if Keycloak is not enabled)
    if (environment.KeycloakEnabled) {
      this.keycloakService.logout();
    } else {
      this.router.navigate(['/not-authorized']);
    }
  }

  public toggleNav() {
    this.isNavMenuOpen = !this.isNavMenuOpen;
  }
}
