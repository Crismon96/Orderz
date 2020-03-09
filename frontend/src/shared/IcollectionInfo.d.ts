import { Dataset } from './Icollection';

export interface ICollectionInfo {
  uuid: string;
  title: string;
  description: string;
  numberOfDatasets: number;
  numberOfEntries: number;
  favorite: boolean;
  created: string;
}

export interface ICollectionConfig {
  _id: string;
  title: string;
  configuration: Dataset[];
  type: string;
  data: Dataset[];
}
