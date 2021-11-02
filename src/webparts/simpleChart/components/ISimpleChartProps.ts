import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISimpleChartProps {
  heading: string;
  listName: string;
  labelColumnName: string;
  dataColumnName: string;
  context: WebPartContext;
}
