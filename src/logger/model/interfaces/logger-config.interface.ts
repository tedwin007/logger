import { LogLevel } from '../../enums/log-level.enum';
import { SeverityColors } from './severity-color.interface';

interface BaseLoggerConfig {
  apiPath: string;
  nativeLog: boolean;
  authorization: string | null;
  colors: SeverityColors;
  reportOnly: LogLevel[];
}

export type LoggerConfig<T = any> = BaseLoggerConfig & T 
