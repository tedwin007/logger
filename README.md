# Logger, wannabe npm package (will be)

the motivation for this package is to create a unified "Logging language": 
- UI (Angular)
- BE Reporter (Reciver, NodeJS)
- E2E (Cypress)

there is ngx-logger [https://www.npmjs.com/package/ngx-logger] that is commonly used, and frequently get updated.

Unfourtrnlly it lacks some features I need

Such as:
 * Bulk Support - grouping multiple logs together (network-friendly)
 * Caching - in cases like network disconnections we may lose the very data we need the most to identify the issue.
 * MultiFramework - Design for Angular, work only on Angular

  ## Logger Factory
 The logger is responsible for creating new logger instances, has a "global, default" behavior so...
   - There is a default configuration (LOGGER_CONFIG)
   - You don't have to create an instance of the logger, you can use it as a global logger (such as console.log)
 
 ### To get started you can just: 
   ```ts
    Logger.warn('text');
    Logger.info('text');
    Logger.error('error text');
   ```

 ### You can customize the logger by:
  - Define a Global Config 
``` Logger.setGlobalConfig(config)```
  - Override the existing Global Config on a local instance 
``` const localLogger = Logger.create(config)```
### Scope example:
```ts
  // Changing the global config 
    Logger.setGlobalConfig({ colors: { ERROR: "red", WARN: "red", INFO: "red" } });
    Logger.info("red");
  // Customize the colors of local's logger 
    let localLogger = Logger.create({ colors: { ERROR: "red", WARN: "orange", INFO: "blue" } });
    localLogger.logInfo("blue");
    Logger.info(" red");
  // Changing the global config will not effect the local scope config 
  // but will effect any future logger's instances that will be created
    const globalConfig = Logger.getGlobalConfig()
    localLogger = Logger.create({ ...globalConfig, reportOnly: globalConfig.reportOnly });
    localLogger.logInfo("did not change");
```

![alt Result](/Screenshot%202021-03-03%20222140.png)

## Todo:
1.  Abstract & extract all browser-related functionality 
2.  Create a plugin creature and a register method in the logger
3.  Extract angular service from the package 
4.  Use Axios to make an HTTP request and add it as a "peer dep"
5.  Pack & install 
6.  Use the npm package in the Logger's (angular) module. 

## Features that are WIP
- Bulk - network friendlily 
- Global Config As A Stream - changes will affect both future and prev instances
- Better Tracking (trace)

