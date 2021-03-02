import {
  LoggerConfig,
  LOGGER_API_PATH,
  LOGGER_SEVERITY_COLORS,
  MAX_STACK_SIZE
} from "../model";

export const LOGGER_CONFIG: LoggerConfig = {
  apiPath: LOGGER_API_PATH,
  nativeLog: true,
  authorization: null,
  colors: LOGGER_SEVERITY_COLORS,
  cache: {
    activateCache: false,
    maxStackSize: MAX_STACK_SIZE
  },
  reportOnly: [0, 1, 2]
};
