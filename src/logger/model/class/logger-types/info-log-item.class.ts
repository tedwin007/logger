import { BaseLogItem } from './base-log-item.class';
import { LogLevel } from '../../../enums/log-level.enum';
import { LoggerConfig } from '../../interfaces/logger-config.interface';

export class InfoLogItem extends BaseLogItem {

  constructor(public description: string, public category: string = 'code_origin', loggerConfig?: LoggerConfig) {
    super(description, category, LogLevel.INFO, loggerConfig);
  }

  nativeLogImp(): void {
    console.log(...this.logTemplate, this);
  }
}
