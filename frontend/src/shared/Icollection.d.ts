export interface ICollection {
  title: string;
  datasets: Dataset[];
}

export interface Dataset {
  title: string;
  dataType: string;
}