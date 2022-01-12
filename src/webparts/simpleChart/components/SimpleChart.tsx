import * as React from 'react';
import styles from './SimpleChart.module.scss';
import { ISimpleChartProps } from './ISimpleChartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { DateTimePicker, DateConvention, TimeConvention, DateTimePickerStrings } from '@pnp/spfx-controls-react/lib/DateTimePicker';
import { ChartControl, ChartType, ChartPalette, PaletteGenerator} from '@pnp/spfx-controls-react/lib/ChartControl';
import { Chart, ChartData } from 'chart.js';
import { IListService } from '../../services/IListService';
import { ListService } from '../../services/ListService';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { IListItem } from '../../services/IListItem';
import { Placeholder } from '@pnp/spfx-controls-react/lib/Placeholder';
import { ColorMode, Mode } from '../SimpleChartWebPart';
import * as strings from 'SimpleChartWebPartStrings';

export default class SimpleChart extends React.Component<ISimpleChartProps, {}> {
  private _chartElem: ChartControl = undefined;
  private backgroundColors = [['#e31937', '#e31937'], ['#60636a', '#cfcfcf'], ['#e31937', '#e37484'], ['#f55442', '#f5a142', '#f2f22e', '#8aed3e'], ['#003f5c', '#58508d', '#bc5090', '#ff6361', 'ffa600']];
  
  public render(): React.ReactElement<ISimpleChartProps> {

    if(this._chartElem != undefined) {
      this._chartElem.getChart().destroy();
    }
    
    if(this.props.listName === "") {
      return <Placeholder
        iconName='BarChartVerticalFill'
        iconText='Simple Chart'
        description={strings.PlaceholderDescription}
        buttonLabel={strings.PlaceholderButton}
        onConfigure={this._onConfigure}/>;
    }

    return (
      <div className={styles.simpleChart} >
        <ChartControl
          type={ChartType.Bar}
          ref={this._linkElement}
          datapromise={this._loadAsyncData()}
          //loadingtemplate={() => <Spinner size={SpinnerSize.large} label="Loading..."  />}
          //palette={ChartPalette.OfficeMonochromatic1}
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
  
  private _onConfigure = () => {
    // Context of the web part
    this.props.context.propertyPane.open();
  }

  private _loadAsyncData(): Promise<ChartData> {
    return new Promise<ChartData>((resolve, reject) => {
      const dataProvider: IListService = new ListService(this.props.context);

      dataProvider.getChartData(this.props)
      .then((data: ChartData) => {
        // set background color
        if(this.props.mode === Mode.GroupByCount){
          
          let colorpalette = PaletteGenerator.generateNonRepeatingGradient(
          [this.backgroundColors[this.props.colors][0], this.backgroundColors[this.props.colors][1]],
          data.datasets.length);

          if(this.props.colors === ColorMode.Colorful1 || this.props.colors === ColorMode.Colorful2) {
            colorpalette = this.backgroundColors[this.props.colors];
          }
          
          for(let i = 0; i < data.datasets.length; i++) {
            const groupColor = PaletteGenerator.generateNonRepeatingGradient([colorpalette[i]], data.datasets[0].data.length);
            data.datasets[i].backgroundColor = groupColor;
          }
        }
        else {
          let colorpalette = PaletteGenerator.generateNonRepeatingGradient(
          [this.backgroundColors[this.props.colors][0], this.backgroundColors[this.props.colors][1]],
          data.datasets[0].data.length);  
          
          if(this.props.colors === ColorMode.Colorful1 || this.props.colors === ColorMode.Colorful2) {
            colorpalette = this.backgroundColors[this.props.colors];
            colorpalette = PaletteGenerator.generateRepeatingPattern(colorpalette, data.datasets[0].data.length);
          }

          data.datasets[0].backgroundColor = colorpalette;
        }

        resolve(data);
      }).catch(error => {
        reject(error);
      });
    });
  }
}
