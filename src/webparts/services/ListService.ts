import { IListService } from './IListService';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { sp } from '@pnp/sp';
import { IListField } from './IListField';
import { IListItem } from './IListItem';
import { IList } from './IList';
import { ChartData } from 'chart.js';
import { AccessibleChartTable } from '@pnp/spfx-controls-react/lib/ChartControl';
import { ISimpleChartProps } from '../simpleChart/components/ISimpleChartProps';
import { Mode, SortMode } from '../simpleChart/SimpleChartWebPart';
import { PaletteGenerator} from '@pnp/spfx-controls-react/lib/ChartControl';
import { xorBy } from 'lodash';

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

    public getChartData(props: ISimpleChartProps): Promise<ChartData> {
        sp.setup({
            spfxContext: this._context,
            defaultCachingStore: "session", 
            defaultCachingTimeoutSeconds: 3600
        });

        let data: ChartData =
        {
            labels: [],
            datasets: [
                {
                    data: []
                }
            ]
        };

        // get sort column and set adc or desc sorting
        let sortField: string;
        let sortType: boolean;

        if(props.sort == SortMode.Unsorted) {
            sortField = "ID";
            sortType = true;
        }
        else {
            sortField = props.sort == SortMode.AscData || props.sort == SortMode.DescData ? props.dataColumnName : props.labelColumnName;
            sortType = props.sort == SortMode.AscData || props.sort == SortMode.AscLabel ? true : false;
        }

        return new Promise<ChartData>((resolve, reject) => {
            if(props.mode === Mode.Normal) {
                if(props.labelColumnName === '' || props.dataColumnName === '') {
                    reject(new Error('Please select a label and a data column.'));
                    return;
                }

                const fields: string[] = ['Id', props.labelColumnName, props.dataColumnName];

                sp.web.lists.getById(props.listName).items.select(...fields).top(props.max).orderBy(sortField, sortType).usingCaching().get().then((rows: any[]) => {
                    let lbl: string[] = [];
                    let val: number[] = [];
    
                    rows.map((item) => {
                        lbl.push(item[props.labelColumnName]);
                        val.push(item[props.dataColumnName]);
                    });
    
                    data.labels = lbl;
                    data.datasets[0].data = val;

                    resolve(data);
                });
            } else if(props.mode === Mode.Count) {
                let fields: string[] = ['Id', props.labelColumnName];
                sp.web.lists.getById(props.listName).items.select(...fields).top(props.max).usingCaching().get().then((rows: any[]) => {
                    let lbl: string[] = [];
                    let count: number[] = [];

                    rows.map((item) => {
                        // check if new group has to be created
                        let groupId = lbl.indexOf(item[props.labelColumnName]);

                        // if group found add one to count
                        if (groupId > -1) {
                            count[groupId] += 1;
                        }
                        else {
                            lbl.push(item[props.labelColumnName]);
                            count.push(1);
                        }
                    });
                    
                    let result = lbl.map(function (v, i) {
                        return {
                            label  : v,
                            count  : count[i]
                        };
                    }).sort(function (a, b) {
                        let item1, item2;

                        if(props.sort == SortMode.AscData || props.sort == SortMode.DescData) {
                            item1 = a.count;
                            item2 = b.count;
                        } 
                        else
                        {
                            item1 = a.label;
                            item2 = b.label;
                        }


                        if(item1 < item2) return -1;
                        if(item1 > item2) return 1;
                        return 0;
                    })

                    if(sortType === false) {
                        result.reverse();
                    }      

                    result.forEach(function (v, i) {
                        lbl[i] = v.label;
                        count[i] = v.count;
                    });

                    data.labels = lbl;
                    data.datasets[0].data = count;
                    resolve(data);
                });                
            } else if(props.mode === Mode.GroupByCount) {
                let fields: string[] = ['Id', props.labelColumnName, props.dataColumnName];
                sp.web.lists.getById(props.listName).items.select(...fields).top(props.max).usingCaching().get().then((rows: any[]) => {
                    let lbl: string[] = [];
                    let count: number[] = [];
                    let lbl2: string[] = [];
                    let acc = [];

                    let grouped = this.groupBy(rows, props.labelColumnName, props.dataColumnName);
    
                    console.log(grouped);

                    for (var key1 in grouped) {
                        lbl.push(key1);
                        for (var key2 in grouped[key1]) {
                            let obj = {};
                            obj[key2] = grouped[key1][key2];
                            acc.push(obj);
                            lbl2.push(key2);
                        }
                    }

                    var vals = [];
                    acc.forEach( function( obj ){
    
                        for( var key in obj ){
                            if( vals[ key ] === undefined ) 
                                vals[ key ] = []
                    
                            vals[ key ].push( obj[ key ])
                        }
                    
                    })
                    function random_rgba() {
                        var o = Math.round, r = Math.random, s = 255;
                        return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
                    }
    
                    var acc1=[];
                    for (var key1 in vals) {
                        var hh={};

                        var color = random_rgba();
                        hh = {
                        
                            label:key1,
                            data: vals[key1],
                            fill: false,
                            //backgroundColor: color, // same color for all data elements  'rgba(255, 159, 64, 0.2)'
                            //borderColor: 'rgb(255, 159, 64)', // same color for all data elements
                            borderWidth: 1
                        };
                        acc1.push(hh);
    
                    }

                    console.log(acc1);

                    data.labels = lbl;
                    data.datasets = acc1;
                    resolve(data);
                });             
            }
        });
    }

    public groupBy(objectArray, property1, property2) {
        const unique = objectArray.map(item => item[property2]).filter((value, index, self) => self.indexOf(value) === index); 

        return objectArray.reduce((acc, obj) => {
            const key1 = obj[property1];
            const key2 = obj[property2];

            if (!acc[key1]) {
                acc[key1] = {};
                for(let i = 0; i < unique.length; i++) {
                    acc[key1][unique[i]] = 0;
                }
            }

            acc[key1][key2] += 1;

            return acc;
        }, {});
    }
}