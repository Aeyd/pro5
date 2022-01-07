import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISimpleChartProps {
  heading: string;
  mode: number;
  sort: number;
  colors: number;
  listName: string;
  labelColumnName: string;
  dataColumnName: string;
  context: WebPartContext;
}
