import * as React from 'react';
import styles from './SimpleChart.module.scss';
import { ISimpleChartProps } from './ISimpleChartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { DateTimePicker, DateConvention, TimeConvention } from '@pnp/spfx-controls-react/lib/DateTimePicker';
import { ChartControl, ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';
import { ChartData } from 'chart.js';
import { IListService } from '../../services/IListService';
import { ListService } from '../../services/ListService';
import { IListItem } from '../../services/IListItem';
import { Placeholder } from '@pnp/spfx-controls-react/lib/Placeholder';
import { Mode } from '../SimpleChartWebPart';

export default class SimpleChart extends React.Component<ISimpleChartProps, {}> {
  private _chartElem: ChartControl = undefined;
  
  public render(): React.ReactElement<ISimpleChartProps> {
    if(this._chartElem != undefined) {
      //this._chartElem.getChart().destroy();
    }
    
    return (
      <div className={styles.simpleChart} >
        <ChartControl
          type={ChartType.Bar}
          ref={this._linkElement}
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
            scales: {
              xAxes: [{ stacked: true }],
              yAxes: [{
                  stacked: false,
                  ticks: {
                      beginAtZero: true,
                  },
              }]
          }
          }}
        />
        <div style={{ clear: "both" }} />
      </div >
    );
  }

  private _linkElement = (e: ChartControl) => {
    this._chartElem = e;
  }

  private _loadAsyncData(): Promise<ChartData> {
    return new Promise<ChartData>(resolve => {

      const dataProvider: IListService = new ListService(this.props.context);

      if(this.props.mode == Mode.Normal) {
        dataProvider.getChartData(this.props.listName, this.props.labelColumnName, this.props.dataColumnName, this.props.sort).then((data: ChartData) => {
          resolve(data);
        });
      }
      else if(this.props.mode == Mode.Count) {
        dataProvider.getChartDataCount(this.props.listName, this.props.labelColumnName, this.props.sort).then((data: ChartData) => {
          resolve(data);
        });
      }
      else if(this.props.mode == Mode.GroupByCount) {
        dataProvider.getChartDataGroupByCount(this.props.listName, this.props.labelColumnName, this.props.dataColumnName, this.props.sort).then((data: ChartData) => {
          resolve(data);
        });
      }
      else {
        let data: ChartData =
        {
            labels: [],
            datasets: [
                {
                    data: []
                }
            ]
        };
        resolve(data);
      }
    });
  }
}
