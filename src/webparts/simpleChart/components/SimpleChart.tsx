import * as React from 'react';
import styles from './SimpleChart.module.scss';
import { ISimpleChartProps } from './ISimpleChartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { DateTimePicker, DateConvention, TimeConvention } from '@pnp/spfx-controls-react/lib/DateTimePicker';
import { ChartControl, ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';
import { ChartData } from 'chart.js';
import { IListService } from '../../services/IListService';
import { ListService } from '../../services/ListService';
import { IListItem } from '../../../../lib/webparts/services/IListItem';
import { Placeholder } from '@pnp/spfx-controls-react/lib/Placeholder';

export default class SimpleChart extends React.Component<ISimpleChartProps, {}> {
  public render(): React.ReactElement<ISimpleChartProps> {
    return (
      <div className={styles.simpleChart} >
        <ChartControl
          type={ChartType.Bar}
          datapromise={this._loadAsyncData()}
          //loadingtemplate={() => <div>...loading</div>}
          options={{
            title: {
              display: true,
              fullWidth: true,
              text: escape(this.props.heading)
            },
            legend: {
              display: false
            },
            scales:
            {
              yAxes:
                [{
                  ticks:
                  {
                    beginAtZero: true
                  }
                }]
            },
            animation: {
              duration: 0
            }
          }}
        />
      </div >
    );
  }

  private _loadAsyncData(): Promise<ChartData> {
    return new Promise<ChartData>(resolve => {

      // TODO: don't calculate data here, move in new DataProvider class
      const dataProvider: IListService = new ListService(this.props.context);
      dataProvider.getListItems(this.props.listName, this.props.labelColumnName, this.props.dataColumnName).then((listdata: Array<IListItem>) => {
        
        let lbl: string[] = [];
        let val: number[] = [];

        listdata.map((item: IListItem) => {
          lbl.push(item.Label);
          val.push(item.Value);
        });

        // sort from highest to lowest
        val.sort((a,b) => b-a);

        const data: ChartData =
        {
          labels: lbl,
          datasets: [
            {
              data: val, 
              backgroundColor: 'rgb(255, 99, 132)'
            }
          ]
        };

        console.log(lbl);
        console.log(val);

        resolve(data);
      });
    });
  }
}