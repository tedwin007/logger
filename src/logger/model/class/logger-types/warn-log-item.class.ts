import { BaseLogItem } from './base-log-item.class';
import { LogLevel } from '../../../enums/log-level.enum';
import { LoggerConfig } from '../../interfaces/logger-config.interface';

export class WarnLogItem extends BaseLogItem {

  constructor(public description: string, public category: string = 'code_origin', loggerConfig?: LoggerConfig) {
    super(description, category, LogLevel.WARN, loggerConfig);
  }

  nativeLogImp(): void {
    console.log(...this.logTemplate, this);
  }
}

