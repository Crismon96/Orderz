import { ICollection } from './Icollection';

export class Collection implements ICollection {
  constructor(public name, public datasets) {}
}
