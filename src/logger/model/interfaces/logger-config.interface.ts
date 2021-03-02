import { SeverityColors } from './severity-color.interface';
import { LogLevel } from '../../enums/log-level.enum';

export interface LoggerConfig {
  apiPath: string;
  nativeLog: boolean;
  authorization: string | null;
  cache: {
    activateCache: boolean;
    maxStackSize: number;
  };
  colors: SeverityColors;
  reportOnly: LogLevel[];
}
