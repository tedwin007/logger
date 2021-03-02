import { BaseLogItem } from './base-log-item.class';
import { LogLevel } from '../../../enums/log-level.enum';
import { LoggerConfig } from '../../interfaces/logger-config.interface';

export class ErrorLogItem extends BaseLogItem implements Error {
  public name: string;

  get message(): string {
    return this.description;
  }

  constructor(public description: string, name: string, loggerConfig?: LoggerConfig) {
    super(description, name === 'HttpErrorResponse' ? 'network' : 'code_origin', LogLevel.ERROR, loggerConfig);
    this.name = name;
    this.setTrace();
  }

  nativeLogImp(): void {
    console.error(...this.logTemplate, this);
  }

  // todo: the stack need be begin in right place
  private setTrace() {
    this.trace = new Error(this.description).stack?.split('at ') || [];
  }
}

