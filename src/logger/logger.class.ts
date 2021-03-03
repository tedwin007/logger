import { ErrorLogItem, InfoLogItem, WarnLogItem } from './model/class/logger-types';
import { LOGGER_CONFIG } from './constants/logger-config';
import { CacheManager } from './model/class/logger-plugins/cache/logger-cache-manger.class';
import { LoggerWithCaching } from './model/class/logger-plugins/cache/CacheConfiguration';
import { LoggerConfig } from './model/interfaces/logger-config.interface';
import { LoggerReporter } from './model/class/logger-plugins/logger-server-reporter';

export class Logger {
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
    this.logError = Logger.error.bind(this);
    this.logWarn = Logger.warn.bind(this);
    this.logInfo = Logger.info.bind(this);

    /**
     * ?: which is a better option "caching as" :
     * ?1. global & singleton
     * ?2.  local instances (which inherited from the global instance)
     * need to create uniqueId by some repeatable logic,
     * could be the URL that the log was emitted localStorageKey/GroupByType (error/info etc ...) 
     **/
    if (CacheManager.typeGuard(config)) {
      this.cacheManger = new CacheManager(config)
    }
  }

  // Global Logger
  static create(config: Partial<LoggerConfig | LoggerWithCaching>): Logger {
    return new Logger({ ...Logger.getGlobalConfig(), ...config });
  }

  static setGlobalConfig(config: LoggerConfig) {
    Logger.config = { ...Logger.config, ...config };
  }

  static getGlobalConfig(): LoggerConfig {
    return Logger.config;
  }

  static async error(item: Error | ErrorLogItem | string): Promise<ErrorLogItem | null | any> {
    const config = this.config;
    const logItem = ErrorLogItem.toErrorItem(item, config);
    return Logger.reporter.report(logItem, config);
  }

  static async warn(message: string): Promise<ErrorLogItem | null | any> {
    const config = this.config;
    const logItem = new WarnLogItem(message, 'code_origin', config);
    return Logger.reporter.report(logItem, config);
  }

  static async info(message: string): Promise<ErrorLogItem | null | any> {
    const config = this.config;
    const logItem = new InfoLogItem(message, 'code_origin', config);
    return Logger.reporter.report(logItem, config);
  }
}
