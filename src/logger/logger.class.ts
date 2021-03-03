import { ErrorLogItem, InfoLogItem, WarnLogItem } from './model/class/logger-types';
import { LOGGER_CONFIG } from './constants/logger-config';
import { CacheManager } from './model/class/logger-plugins/cache/logger-cache-manger.class';
import { LoggerWithCaching } from './model/class/logger-plugins/cache/CacheConfiguration';
import { LoggerConfig } from './model/interfaces/logger-config.interface';
import { LoggerReporter } from './model/class/logger-plugins/logger-server-reporter';

/**
 *  Logger Factory
 *  @description LoggerFactory is responsible for log different types of  severities logs
 *  you can customize the logger behavior  by defining GlobalConfig/Overbidding the existing GlobalConfig 
 *  by creating a "local logger" instance.
 *  !Please note:
 *  !There is a default configuration in-place {@see LOGGER_CONFIG | LOGGER_CONFIG}
 *  !You don't have to create an instance of the logger to get started you can just do 
 *   @example 
 *    ```ts
 *    LoggerFactory.warn(''text" );
 *    LoggerFactory.info(''text" );
*     LoggerFactory.error(''Error text" );
 *   ```
 *   todo: add Proxy Guard for the plugins

 * 
 */
export class LoggerFactory {
  private static reporter = new LoggerReporter()
  private static config: LoggerConfig = LOGGER_CONFIG;

  // Local Logger
  config: LoggerConfig | LoggerWithCaching;
  cacheManger?: CacheManager;
  logError: (item: Error | ErrorLogItem | string) => Promise<any>;
  logWarn: (message: string) => Promise<any>;
  logInfo: (message: string) => Promise<any>;

  protected constructor(config: LoggerConfig | LoggerWithCaching) {
    this.config = config;
    this.logError = LoggerFactory.error.bind(this);
    this.logWarn = LoggerFactory.warn.bind(this);
    this.logInfo = LoggerFactory.info.bind(this);

    /**
     * ?: which is a better option "caching as" :
     * ?1. global & singleton
     * ?2.  local instances (which inherited from the global instance)
     *  if so, I need to create uniqueId by some repeatable logic, could be the URL that the log was emitted (as key in the localStorage) / GroupBy Type (error/info etc ...) 
    **/
    if (CacheManager.typeGuard(config)) {
      this.cacheManger = new CacheManager(config)
    }
  }

  // Global Logger
  static create(config: Partial<LoggerConfig | LoggerWithCaching>): LoggerFactory {
    return new LoggerFactory({ ...LoggerFactory.getGlobalConfig(), ...config });
  }

  static setGlobalConfig(config: LoggerConfig) {
    LoggerFactory.config = { ...LoggerFactory.config, ...config };
  }

  static getGlobalConfig(): LoggerConfig {
    return LoggerFactory.config;
  }

  static async error(item: Error | ErrorLogItem | string): Promise<ErrorLogItem | null | any> {
    const config = this?.config;
    const logItem = ErrorLogItem.toErrorItem(item, config);
    return LoggerFactory.reporter.report(logItem, config);
  }

  static async warn(message: string): Promise<ErrorLogItem | null | any> {
    const config = this?.config;
    const logItem = new WarnLogItem(message, 'code_origin', config);
    return LoggerFactory.reporter.report(logItem, config);
  }

  static async info(message: string): Promise<ErrorLogItem | null | any> {
    const config = this?.config;
    const logItem = new InfoLogItem(message, 'code_origin', config);
    return LoggerFactory.reporter.report(logItem, config);
  }
}
