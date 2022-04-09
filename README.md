# simple-chart

## Project Setup

[Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-development-environment)
(NOTE: different dependecies needed for SharePoint On-Premises 2019)

- install node-v8.17.0-x64
- ```npm install gulp@3.9.1 --global```
- ```npm install yo@3.1.1 --global```
- ```npm install @microsoft/generator-sharepoint@1.9.1 --global```
- create a project folder
- ```yo @microsoft/sharepoint```
- run Yeoman setup, target platform **SharePoint 2019 or later**, framework **React**
- ```gulp trust-dev-cert```
- ```gulp serve```

## Install Chart Library

- ```npm i @pnp/spfx-controls-react@1.19.0```
- add ```import { ChartControl, ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';``` to use ChartControls for SPFx

## Developer Toolchain

- Node.js - runtime environment
- npm - packagemanager
- Visual Studio Code - code editor
- Yeoman - code generator
- React - js framework
- TypeScript - coding language
- gulp - taskmanager

## Used SharePoint Framework Version

- SharePoint Framework v1.4.1

## Minimal Path to Awesome

- install node-v8.17.0-x64
- ```npm install gulp@3.9.1 --global```
- install Visual Studio Code
- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**
  - **gulp serve**

## References

- [SPFx Samples](https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples)
- [SPFx ChartControls](https://pnp.github.io/sp-dev-fx-controls-react/controls/ChartControl/)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development
- [SharePoint Framework SPFx Webinar by Andrew Connell](https://www.youtube.com/watch?v=AO69ziaCxMc)
