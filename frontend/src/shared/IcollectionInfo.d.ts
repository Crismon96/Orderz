import { Dataset } from './Icollection';

export interface ICollectionInfo {
  name: string;
  description: string;
  numberOfDatasets: number;
  numberOfEntries: number;
}

export interface ICollectionConfig {
  _id: string;
  configuration: Dataset[];
}
