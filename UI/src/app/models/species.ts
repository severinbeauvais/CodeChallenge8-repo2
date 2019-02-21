import * as _ from 'lodash';

export class Image {
  name: string;
  type: string;
  data: string; // array of bytes
  size: number;
  md5: string;

  constructor(obj?: any) {
    this.name         = obj && obj.name         || null;
    this.type         = obj && obj.type         || null;
    this.data         = obj && obj.data         || null;
    this.size         = obj && obj.size         || 0;
    this.md5          = obj && obj.md5          || null;
  }
}

export class Species {
  // the following are retrieved from the API
  _id: string;
  commonName: string;
  latinName: string;
  category: string;
  dateIntroBC: Date = null;
  description: string = null;
  image: Image = null;

  constructor(obj?: any) {
    this._id          = obj && obj._id          || null;
    this.commonName   = obj && obj.commonName   || null;
    this.latinName    = obj && obj.latinName    || null;
    this.category     = obj && obj.category     || null;

    // copy date
    if (obj && obj.dateIntroBC) {
      this.dateIntroBC = new Date(obj.dateIntroBC);
    }

    // replace \\n (JSON format) with newlines
    if (obj && obj.description) {
      this.description = obj.description.replace(/\\n/g, '\n');
    }

    // copy image - object must exist
    this.image = new Image(obj && obj.image || null);
  }
}
