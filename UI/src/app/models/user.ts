export class User {
  // the following are retrieved from the API
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: Date = null;

  constructor(obj?: any) {
    this._id       = obj && obj._id       || null;
    this.username  = obj && obj.username  || null;
    this.firstName = obj && obj.firstName || null;
    this.lastName  = obj && obj.lastName  || null;
    this.email     = obj && obj.email     || null;
  }
}
