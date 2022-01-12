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
  ColorFieldMono1: string;
  ColorFieldMono2: string;
  ColorFieldColor1: string;
  ColorFieldColor2: string;
  ModeFieldNormal: string;
  ModeFieldCount: string;
  ModeFieldGroup: string;
  GeneralFieldLabel: string;
  DataGroupName: string;
  ModeFieldList: string;
  LabelFieldLabel: string;
  DataFieldLabel: string;
  PlaceholderDescription: string;
  PlaceholderButton: string;
}

declare module 'SimpleChartWebPartStrings' {
  const strings: ISimpleChartWebPartStrings;
  export = strings;
}
