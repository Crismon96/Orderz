export interface ICollection {
  title: string;
  datasets: Dataset[];
}

export interface Dataset {
  title: string;
  dataType: string;
  data?: string | number | boolean;
  submissionDate?: Date;
  options?: string[];
}
