import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { KeycloakService, KeycloakAuthGuard } from 'keycloak-angular';

import { environment } from '../environments/environment';
import { UserService } from './services/user.service';

@Injectable()
export class AppAuthGuard extends KeycloakAuthGuard {
  constructor(protected router: Router, protected keycloakAngular: KeycloakService, private userService: UserService) {
    super(router, keycloakAngular);
  }

  isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    if (!environment.KeycloakEnabled) {
      return Promise.resolve(true);
    }

    return new Promise((resolve, reject) => {
      if (!this.authenticated) {
        this.keycloakAngular.login();
        return;
      }

      const requiredRoles = route.data.roles;
      if (!requiredRoles || requiredRoles.length === 0) {
        return resolve(true);
      } else {
        if (!this.roles || this.roles.length === 0) {
          resolve(false);
        }
        let granted = false;
        for (const requiredRole of requiredRoles) {
          if (this.roles.indexOf(requiredRole) > -1) {
            granted = true;
            break;
          }
        }

        return this.keycloakAngular
          .loadUserProfile()
          .then(profile => {
            const currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
            if (currentUser.username === profile.username && !currentUser.added) {
              // Add/Update the user to the database
              return this.userService.put(profile).toPromise().then(() => {
                return this.keycloakAngular.getToken().then(token => {
                  window.localStorage.setItem('currentUser', JSON.stringify({ username: profile.username, token: token, added: true }));
                });
              })
              .catch(err => {
                console.log('addUser error: ', err);
                throw err;
              });
            }
          })
          .then(() => resolve(granted));
      }
    });
  }
}
