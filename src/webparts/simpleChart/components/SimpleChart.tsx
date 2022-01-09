import * as React from 'react';
import styles from './SimpleChart.module.scss';
import { ISimpleChartProps } from './ISimpleChartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { DateTimePicker, DateConvention, TimeConvention } from '@pnp/spfx-controls-react/lib/DateTimePicker';
import { ChartControl, ChartType, ChartPalette} from '@pnp/spfx-controls-react/lib/ChartControl';
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
      let chart = this._chartElem.getChart();
      if(chart != undefined) {
        chart.destroy();
      }
    }
    
    return (
      <div className={styles.simpleChart} >
        <ChartControl
          type={ChartType.Bar}
          ref={this._linkElement}
          datapromise={this._loadAsyncData()}
          //loadingtemplate={() => <div>...loading</div>}
          palette={ChartPalette.OfficeMonochromatic1}
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

      dataProvider.getChartData(this.props).then((data: ChartData) => {
        resolve(data);
      });
    });
  }
}
