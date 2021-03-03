
import { LogLevel } from '../enums/log-level.enum';
import { CacheConfiguration, LoggerWithCaching } from '../model/class/logger-plugins/cache/CacheConfiguration';
import { MAX_STACK_SIZE, LOGGER_API_PATH, LOGGER_SEVERITY_COLORS } from './constants';

const cacheConfig: CacheConfiguration = {
  activateCache: false,
  maxStackSize: MAX_STACK_SIZE
};

export const LOGGER_CONFIG: LoggerWithCaching = {
  apiPath: LOGGER_API_PATH,
  nativeLog: true,
  authorization: null,
  colors: LOGGER_SEVERITY_COLORS,
  cache: cacheConfig,
  reportOnly: [LogLevel.ERROR, LogLevel.INFO, LogLevel.WARN]
};
