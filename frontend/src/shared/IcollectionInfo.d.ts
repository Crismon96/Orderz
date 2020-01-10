import { Dataset } from './Icollection';

export interface ICollectionInfo {
  uuid: string;
  title: string;
  description: string;
  numberOfDatasets: number;
  numberOfEntries: number;
  created: string;
}

export interface ICollectionConfig {
  _id: string;
  configuration: Dataset[];
}
