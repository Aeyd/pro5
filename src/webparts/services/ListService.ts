import { IListService } from './IListService';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { sp } from '@pnp/sp';
import { IListField } from './IListField';
import { IListItem } from './IListItem';
import { IList } from './IList';
import { ChartData } from 'chart.js';
import { AccessibleChartTable } from '@pnp/spfx-controls-react/lib/ChartControl';

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

                rows.map((item) => {
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

    public getChartDataCount(listId: string, labelField: string): Promise<ChartData> {
        sp.setup({
            spfxContext: this._context
        });

        let fields: string[] = ['Id', labelField];

        return new Promise<ChartData>(resolve => {
            sp.web.lists.getById(listId).items.select(...fields).get().then((rows: any[]) => {
                let lbl: string[] = [];
                let count: number[] = [];

                rows.map((item) => {
                    let groupId = lbl.indexOf(item[labelField]);
                    if (groupId > -1) {
                        count[groupId] += 1;
                    }
                    else {
                        lbl.push(item[labelField]);
                        count.push(1);
                    }
                });

                let data: ChartData =
                {
                    labels: lbl,
                    datasets: [
                        {
                            data: count
                        }
                    ]
                };

                resolve(data);
            });
        });
    }

    public getChartDataGroupByCount(listId: string, labelField: string, valueField: string): Promise<ChartData> {
        sp.setup({
            spfxContext: this._context
        });

        let fields: string[] = ['Id', labelField, valueField];

        return new Promise<ChartData>(resolve => {
            sp.web.lists.getById(listId).items.select(...fields).get().then((rows: any[]) => {
                let lbl: string[] = [];
                let count: number[] = [];
                let lbl2: string[] = [];
                let acc = [];


                

                let grouped = this.groupBy(rows, labelField, valueField);

                JSON.stringify(grouped);
                console.log(grouped);
          
                

                for (var key1 in grouped) {
                    lbl.push(key1);

                    console.log("wee" + key1);
                    for (var key2 in grouped[key1]) {


                        console.log("wee2" + key2);

                        console.log("dddddd" + grouped[key1][key2]);

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



                var acc1=[];
                var color={
                        0:
                            ["5, 1, 145, 0.8",
                            "86, 1, 145, 0.8",
                            "217, 1, 145, 0.8"
                        ]
                }
                ;


                var index = 0; 
                for (var key1 in vals) {



                    var hh={};
                    //var color = random_rgba();




                     hh = {
                        label:key1,
                        data: vals[key1],
                        fill: false,
                        backgroundColor: 'rgba('+color[0][index]+')', // same color for all data elements  'rgba(255, 159, 64, 0.2)'
                        borderColor: 'rgb(255, 159, 64)', // same color for all data elements
                        borderWidth: 1
                    };
                    acc1.push(hh);
                    index+=1;
                }
                
            

                console.log(acc);
                console.log(vals);


                 console.log("/////////////////");

                console.log("key1 "+lbl);
                console.log("key1 0 "+lbl[0]);
                console.log("key1 1"+lbl[1]);
                console.log("/////////////////");

                console.log("key2 "+lbl2);
                console.log("key2 0 "+lbl2[0]);
                console.log("key2 1 "+lbl2[1]);
                console.log("/////////////////");

                console.log("zahl "+count);
                console.log("zahl 0 "+count[0]);
                console.log("zahl 1 "+count[1]);
                console.log("/////////////////");


                let data: ChartData =
                {
                    labels: lbl,
                    datasets: 
                        acc1,
                };

                resolve(data);
            });
        });
    }

    public groupBy(objectArray, property1, property2) {

  /*
            objectArray.sort(function (a, b) {
                return a.property1.localeCompare(b.property1) || b.property2.localeCompare(a.property2);
            });
             */

        console.log(objectArray);

        return objectArray.reduce((acc, obj) => {
            const key1 = obj[property1];
            const key2 = obj[property2];
            
            if (!acc[key1]) {
                acc[key1] = [];
            }
            if (!acc[key1][key2]) {
                acc[key1][key2] = 0;
                
            }

            acc[key1][key2] += 1;

            return acc;
        }, {});
    }


}