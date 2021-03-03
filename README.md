# Logger, wannabe npm package (will be)

the motivation for this package is to create a unified "Logging language": 
- UI (Angular)
- BE Reporter (Reciver, NodeJS)
- E2E (Cypress)

there is ngx-logger [https://www.npmjs.com/package/ngx-logger] that is commonly used, and frequently get updated.

Unfourtrnlly it lack some features I needs

Such as:
 * Bulk Support - grouping multiple logs together (network friendly)
 * Caching - in cases like network disconnections we may lose the very data we need the must to identify the issue.
 * MultiFramework - Design for Angular, work only on Angular

  ## Logger Factory
 LoggerFactory is responsible for creating new logger instances,has a "global, defualt" behaviour so...
   - There is a default configuration (LOGGER_CONFIG)
   - You don't have to create an instance of the logger, you can use it as a global logger (such as console.log)
 
 ### To get started you can just: 
   ```ts
    LoggerFactory.warn('text');
    LoggerFactory.info('text');
    LoggerFactory.error('error text');
   ```

 ### You can customize the logger by:
  - Define a Global Config 
``` LoggerFactory.setGlobalConfig(config)```
  - Override the existing Global Config on a local instance 
``` const localLogger = LoggerFactory.create(config)```
### Scope example:
```ts
  // Changing the global config 
    LoggerFactory.setGlobalConfig({ colors: { ERROR: "red", WARN: "red", INFO: "red" } });
    LoggerFactory.info("red");
  // Customize the colors of local's logger 
    let localLogger = LoggerFactory.create({ colors: { ERROR: "red", WARN: "orange", INFO: "blue" } });
    localLogger.logInfo("blue");
    LoggerFactory.info(" red");
  // Changing the global config will not effect the local scope config 
  // but will effect any future logger's instances that will be created
    const globalConfig = LoggerFactory.getGlobalConfig()
    localLogger = LoggerFactory.create({ ...globalConfig, reportOnly: globalConfig.reportOnly });
    localLogger.logInfo("did not change");
```
![alt Result](/Screenshot%202021-03-03%20222140.png)

## Todo:
1.  Abstract & extract all browser related functionality 
2.  Create a plugin creature and a register method in the logger
3.  Extract angular service from the package 
4.  Use axios to make http request and add it as a "peer dep"
5.  Pack & install 
6.  Use the npm package in  the Logger's (angular) module. 

## Features that are WIP
- Bulk - network friendlily 
- Global Config As A Stream - changes will effect both future and prev instances
- Better Tracking (trace)

