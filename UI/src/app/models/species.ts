import * as _ from 'lodash';
import { Document } from './document';

class Image {
  _id: string;
  data: string; // array of bytes
  length: number;
  md5: string;

  constructor(obj?: any) {
    this._id          = obj && obj._id          || null;
    this.data         = obj && obj.data         || null;
    this.length       = obj && obj.length       || null;
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

  // associated data
  documents: Array<Document> = [];

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

    // copy image
    if (obj && obj.image) {
      this.image = new Image(obj.image);
    }

    // copy documents
    if (obj && obj.documents) {
      for (const doc of obj.documents) {
        this.documents.push(doc);
      }
    }
  }
}
