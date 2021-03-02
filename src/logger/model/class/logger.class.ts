import { LoggerUtils } from '../logger-utils';
import { BaseLogItem, ErrorLogItem, InfoLogItem, WarnLogItem } from './logger-types';
import { LOGGER_CONFIG } from '../../constants/logger-config';
import { LoggerInstance } from '../interfaces/logger-instance.interface';
import { LoggerCacheManger } from './logger-cache-manger.class';
import { LogLevel } from '../../enums/log-level.enum';
import { LoggerConfig } from '../interfaces/logger-config.interface';

export class Logger extends LoggerCacheManger {
  private static config: LoggerConfig;
  
  static setRootConfig(config: LoggerConfig) {
    Logger.config = config;
  }

  static getRootConfig(): LoggerConfig {
    return Logger.config ?? LOGGER_CONFIG;
  }

  static create(config: Partial<LoggerConfig>): LoggerInstance {
    const tempConfig: LoggerConfig = {...Logger.getRootConfig(), ...config};
    const logger = new Logger(tempConfig);
    // todo: create local LoggerCacheManger for a logger instance?
    if (tempConfig.cache.activateCache) {
      Logger.initCaching(tempConfig);
    }
    return {
      config: logger.config,
      logError: Logger.error.bind(logger),
      logWarn: Logger.warn.bind(logger),
      logInfo: Logger.info.bind(logger)
    };
  }

  constructor(public config: LoggerConfig) {
    super();
  }

  static async error(item: Error | ErrorLogItem | string): Promise<any> {
    const config = this?.config;
    const logItem = LoggerUtils.toLoggerErrorItem(item, config);
    const level = LogLevel.ERROR;
    return Logger.report(logItem, level, config);
  }

  static async warn(message: string): Promise<any> {
    const config = this?.config;
    const logItem = new WarnLogItem(message, 'code_origin', config);
    const level = LogLevel.WARN;
    return Logger.report(logItem, level, config);
  }

  static async info(message: string): Promise<any> {
    const config = this?.config;
    const logItem = new InfoLogItem(message, 'code_origin', config);
    const level = LogLevel.INFO;
    return Logger.report(logItem, level, config);
  }

  static onServerReportFail(origin: BaseLogItem): (newItem: Error) => void {
    return (newItem: Error) => {
      const newLogItem: ErrorLogItem = LoggerUtils.toLoggerErrorItem(newItem, this.config);
      origin.trace.push(newLogItem);
      Logger.addItemToCache(origin);
    };
  }

  private static async report(logItem: WarnLogItem, level: LogLevel, config?: LoggerConfig): Promise<any> {
    return config?.reportOnly?.includes(level) ?
      LoggerUtils.sendToServer(logItem, config)
        .catch((err: Error) => {
          if (config.cache.activateCache) {
            Logger.onServerReportFail(logItem)(err);
          }
        }) : null;
  }
}
