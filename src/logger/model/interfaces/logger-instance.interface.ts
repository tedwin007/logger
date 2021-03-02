import { ErrorLogItem } from '../class/logger-types';
import { LoggerConfig } from './logger-config.interface';

export interface LoggerInstance {
    logError: (item: (Error | ErrorLogItem | string)) => Promise<any>;
    logWarn: (message: string) => Promise<any>;
    logInfo: (message: string) => Promise<any>;
    config: LoggerConfig;
}
