import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { ApiService } from 'app/services/api';
import { JwtUtil } from 'app/jwt-util';
import { KeycloakService } from 'app/services/keycloak.service';

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

export class HeaderComponent implements OnInit {
  isNavMenuOpen = false;
  welcomeMsg: String;
  private _api: ApiService;
  public jwt: {
    username: String,
    realm_access: {
      roles: Array<String>
    }
    scopes: Array<String>
  };

  constructor(
    private api: ApiService,
    private keycloakService: KeycloakService,
    public router: Router
  ) {
    this._api = api;
  }

  ngOnInit() {
  }

  navigateToLogout() {
    // reset login status
    this.api.logout();
  }

  toggleNav() {
    this.isNavMenuOpen = !this.isNavMenuOpen;
  }

  closeNav() {
    this.isNavMenuOpen = false;
  }
}
