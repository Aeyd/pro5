declare interface ISimpleChartWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  SortFieldLabel: string;
  OptionsFieldLabel: string;
  ColorFieldLabel: string;
  ModeFieldLabel: string;
  SortFileUnsorted:  string;
  SortFileAsc: string;
  SortFileDesc: string;
  SortFileAscD: string;
  SortFileDescD: string;
  ColorFieldStandard: string;
  ColorFieldMonochrome: string;
  ColorFieldColor: string;
  ModeFieldNormal: string;
  ModeFieldCount: string;
  ModeFieldGroup: string;
  GeneralFieldLabel: string;
  DataGroupName: string;
  ModeFieldList: string;
  LabelFieldLabel: string;
  DataFieldLabel: string;
}

declare module 'SimpleChartWebPartStrings' {
  const strings: ISimpleChartWebPartStrings;
  export = strings;
}
