import { BaseLogItem, ErrorLogItem } from './class/logger-types';
import { LoggerConfig } from './interfaces/logger-config.interface';

export class LoggerUtils {
  static toLoggerErrorItem(item: Error | ErrorLogItem | string, config: LoggerConfig): ErrorLogItem {
    if (typeof item !== 'string') {
      return 'trace' in item ? item : new ErrorLogItem(item.message, item.name, config);
    } else {
      return new ErrorLogItem(item, 'Unnamed', config);
    }
  }

  static async sendToServer(logItem: BaseLogItem | BaseLogItem[], config: LoggerConfig): Promise<any> {
    try {
      const response = await fetch(
        config.apiPath,
        {
          method: 'POST',
          headers: {
            Authorization: config.authorization!,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(logItem)
        });
      return response.json();
    } catch (e) {
      return LoggerUtils.toLoggerErrorItem(e, config);
    }
  }
}
