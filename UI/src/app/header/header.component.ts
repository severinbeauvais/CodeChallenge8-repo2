import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ApiService } from 'app/services/api';

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
  public welcomeMsg: String;
  public jwt: {
    username: String,
    realm_access: {
      roles: Array<String>
    },
    scopes: Array<String>
  };

  constructor(
    private api: ApiService
  ) { }

  // NOT NEEDED?
  navigateToLogout() {
    // reset login status
    this.api.logout();
  }

  public toggleNav() {
    this.isNavMenuOpen = !this.isNavMenuOpen;
  }
}
