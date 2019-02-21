import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './api';

import { User } from 'app/models/user';

@Injectable()
export class UserService {

  constructor(
    private api: ApiService
  ) { }

  // create new user
  put(item: any): Observable<User> {
    const app = new User(item);

    // id must not exist on POST
    delete app._id;

    return this.api.putUser(app)
      .catch(error => this.api.handleError(error));
  }
}
