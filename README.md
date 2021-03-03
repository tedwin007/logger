# Logger
This logger will be packed to an npm package.
The motivation for creating this logger is to create a common "language" in different env

In my case I want to use it in the: 
- UI (Angular)
- BE Reporter (Reciver, NodeJS)
- E2E (Cypress)

there is ngx-logger [https://www.npmjs.com/package/ngx-logger] that is commonly used, and frequently get updated. 
Unfourtrnlly it lack some features as:
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
  //  Changing the root config 
    LoggerFactory.setGlobalConfig({ colors: { ERROR: "red", WARN: "red", INFO: "red" } });
    LoggerFactory.info("red");
  // Customize logs colors in a local's logger 
    let localLogger = LoggerFactory.create({ colors: { ERROR: "red", WARN: "orange", INFO: "blue" } });
    localLogger.logInfo("blue");
    LoggerFactory.info(" red");
  // Changing the root config , will not effect the local scope config  
  //  But will effect any new logger's instances  that will be created
    const globalConfig = LoggerFactory.getGlobalConfig()
    localLogger = LoggerFactory.create({ ...globalConfig, reportOnly: globalConfig.reportOnly });
    localLogger.logInfo("did not change");
```

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
-  Better Tracking (trace)
![alt Result](/Screenshot%202021-03-03%20222140.png)
