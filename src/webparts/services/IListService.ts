import { IList } from './IList';
import { IListField } from './IListField';
import { IListItem } from './IListItem';
import { ChartData } from 'chart.js';

export interface IListService {
    getLists(): Promise<Array<IList>>;
    getFields(listId: string): Promise<Array<IListField>>;
    getListItems(listId: string, labelField: string, valueField: string): Promise<Array<IListItem>>;
    getChartData(listId: string, labelField: string, valueField: string): Promise<ChartData>;
    getChartDataCount(listId: string, labelField: string, valueField: string): Promise<ChartData>;
}