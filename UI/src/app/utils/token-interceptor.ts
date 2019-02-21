import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpInterceptor
} from '@angular/common/http';

import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth: KeycloakService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokenObs = from  (this.auth.getToken());

    return tokenObs.pipe(
      switchMap((token) => {
        const authToken = token || '';
        console.log('Interceptor Token:', authToken);
        request = request.clone({
          setHeaders: {
            'Authorization': 'Bearer ' + authToken
          }
        });

        return next.handle(request).pipe(
          map((resp: HttpResponse<any>) => {
            if (resp) {
              // console.log('interceptor header keys: ', resp.headers && resp.headers.get('x-total-count'));
              // console.log('interceptor X-Service-Name: ', resp.headers.get('X-Service-Name'));
            }
            return resp;
          })
        );
      })
    );


  }

}
