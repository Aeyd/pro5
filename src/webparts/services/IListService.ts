import { IList } from './IList';
import { IListField } from './IListField';
import { IListItem } from './IListItem';
import { ChartData } from 'chart.js';
import { ISimpleChartProps } from '../simpleChart/components/ISimpleChartProps';

export interface IListService {
    getLists(): Promise<Array<IList>>;
    getFields(listId: string): Promise<Array<IListField>>;
    getChartData(props: ISimpleChartProps): Promise<ChartData>;
}