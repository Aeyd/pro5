import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown,
  PropertyPaneCheckbox,
  WebPartContext
} from '@microsoft/sp-webpart-base';

import * as strings from 'SimpleChartWebPartStrings';
import SimpleChart from './components/SimpleChart';
import { ISimpleChartProps } from './components/ISimpleChartProps';
import { ListService } from '../services/ListService';
import { IList } from '../services/IList';
import { IListField } from '../services/IListField';
import { IListService } from '../services/IListService';

export interface ISimpleChartWebPartProps {
  heading: string;
  listName: string;
  labelColumnName: string;
  dataColumnName: string;
  context: WebPartContext;
}

/* TODO:

- finish property pane (multiple rows? colors?)
- display placeholder (https://pnp.github.io/sp-dev-fx-controls-react/controls/Placeholder/) when chart is not configured
- set colors for Chart (either EGGER red or gray)
- use the strings. functionality translate webpart in German and English
- cache List requests

ERROR:
- dont make list request for chart data when webpart not fully configured

*/



export default class SimpleChartWebPart extends BaseClientSideWebPart<ISimpleChartWebPartProps> {
  private lists: IPropertyPaneDropdownOption[];
  private columns: IPropertyPaneDropdownOption[];

  private listsDropdownDisabled: boolean;
  private columnDropdownDisabled: boolean;

  public render(): void {
    const element: React.ReactElement<ISimpleChartProps > = React.createElement(
      SimpleChart,
      {
        heading: this.properties.heading,
        listName: this.properties.listName,
        labelColumnName: this.properties.labelColumnName,
        dataColumnName: this.properties.dataColumnName,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  
  // protected get disableReactivePropertyChanges(): boolean {
  //   return true;
  // }
  
  protected onInit(): Promise<void> {
    this.columnDropdownDisabled = !this.properties.listName;

    return super.onInit();
  }

  protected onPropertyPaneConfigurationStart(): void {
    this.listsDropdownDisabled = !this.lists;
    this.columnDropdownDisabled = !this.properties.listName || !this.columns;

    if (this.lists) {
      return;
    }

    this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'options');

    this.loadLists()
      .then((listOptions: IPropertyPaneDropdownOption[]): Promise<IPropertyPaneDropdownOption[]> => {
        this.lists = listOptions;
        this.listsDropdownDisabled = false;
        this.context.propertyPane.refresh();
        return this.loadColumns();
      })
      .then((columnOptions: IPropertyPaneDropdownOption[]): void => {
        this.columns = columnOptions;
        this.columnDropdownDisabled = !this.properties.listName;
        this.context.propertyPane.refresh();
        this.context.statusRenderer.clearLoadingIndicator(this.domElement);
        this.render();
      });
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (propertyPath === 'listName' && newValue) {
      // push new list value
      super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
      // get previously selected item
      const previousItem: string = this.properties.labelColumnName;
      // reset selected item
      this.properties.labelColumnName = undefined;
      // push new item value
      this.onPropertyPaneFieldChanged('labelColumnName', previousItem, this.properties.labelColumnName);
      // disable item selector until new items are loaded
      this.columnDropdownDisabled = true;
      // refresh the item selector control by repainting the property pane
      this.context.propertyPane.refresh();
      // communicate loading items
      this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'columns');

      this.loadColumns()
        .then((columnOptions: IPropertyPaneDropdownOption[]): void => {
          // store items
          this.columns = columnOptions;
          // enable item selector
          this.columnDropdownDisabled = false;
          // clear status indicator
          this.context.statusRenderer.clearLoadingIndicator(this.domElement);
          // re-render the web part as clearing the loading indicator removes the web part body
          this.render();
          // refresh the item selector control by repainting the property pane
          this.context.propertyPane.refresh();
        });
    }
    else {
      super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    }
  }

  private loadLists(): Promise<IPropertyPaneDropdownOption[]> {
    const dataService: IListService = new ListService(this.context);
    return new Promise<IPropertyPaneDropdownOption[]>(resolve => {
      dataService.getLists()
      .then((response: IList[]) => {
          let options : IPropertyPaneDropdownOption[] = [];

          response.forEach((item: IList) => {
            options.push({'key': item.Id, 'text': item.Title});
          });
          
          resolve(options);
      });
    });
  }

  private loadColumns(): Promise<IPropertyPaneDropdownOption[]> {
    if (!this.properties.listName) {
      // resolve to empty options since no list has been selected
      return;
    }

    const dataService: IListService = new ListService(this.context);

    return new Promise<IPropertyPaneDropdownOption[]>(resolve => {
      dataService.getFields(this.properties.listName)
      .then((response: IListField[]) => {
          let options : IPropertyPaneDropdownOption[] = [];

          response.forEach((item: IListField) => {
            // note: key is title here and not id, fields are accessed with string name 
            options.push({'key': item.InternalName, 'text': item.Title});
          });
          
          resolve(options);
      });
    });
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('heading', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneDropdown('listName', {
                  label: 'List',
                  options: this.lists,
                  disabled: this.listsDropdownDisabled
                }),
                PropertyPaneDropdown('labelColumnName', {
                  label: 'Label Column',
                  options: this.columns,
                  disabled: this.columnDropdownDisabled
                }),
                PropertyPaneDropdown('dataColumnName', {
                  label: 'Data Column',
                  options: this.columns,
                  disabled: this.columnDropdownDisabled
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
