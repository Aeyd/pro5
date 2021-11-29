import { IListService } from './IListService';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { sp } from '@pnp/sp';
import { IListField } from './IListField';
import { IListItem } from './IListItem';
import { IList } from './IList';
import { ChartData } from 'chart.js';

export class ListService implements IListService {
    private _context: WebPartContext;

    /**
     *
     */
    constructor(context: WebPartContext) {
        this._context = context;
    }

    public getLists(): Promise<Array<IList>> {
        sp.setup({
            spfxContext: this._context
        });

        return sp.web.lists.filter('Hidden eq false')
            .select('Id', 'Title').get();
    }

    public getFields = (listId: string): Promise<Array<IListField>> => {
        sp.setup({
            spfxContext: this._context
        });

        return sp.web.lists.getById(listId).fields.filter('ReadOnlyField eq false and Hidden eq false')
            .select('Id', 'Title', 'InternalName', 'TypeAsString').get();
    }

    // unused
    public getListItems(listId: string, labelField: string, valueField: string): Promise<Array<IListItem>> {
        sp.setup({
            spfxContext: this._context
        });

        // build the list of fields we need
        let fields: string[] = ['Id', labelField, valueField];

        return sp.web.lists.getById(listId).items.select(...fields).get().then((rows: any[]) => {
            return rows.map((item: any) => {
                let listItem: IListItem = {
                    Id: item.Id,
                    Label: item[labelField],
                    Value: item[valueField]
                };
                return listItem;
            });
        });
    }

    public getChartData(listId: string, labelField: string, valueField: string): Promise<ChartData> {
        sp.setup({
            spfxContext: this._context
        });

        let fields: string[] = ['Id', labelField, valueField];

        return new Promise<ChartData>(resolve => {
            sp.web.lists.getById(listId).items.select(...fields).get().then((rows: any[]) => {
                let lbl: string[] = [];
                let val: number[] = [];

                rows.map((item: IListItem) => {
                    lbl.push(item[labelField]);
                    val.push(item[valueField]);
                });

                let data: ChartData =
                {
                    labels: lbl,
                    datasets: [
                        {
                            data: val
                        }
                    ]
                };

                resolve(data);
            });
        });
    }
}