import { SeverityColors } from '../model/interfaces/severity-color.interface';

export const LOGGER_API_PATH: string = "api/v1/logger";
export const MAX_STACK_SIZE = 20;
export const LOGGER_SEVERITY_COLORS: SeverityColors = {
  ERROR: "blue",
  WARN: "orange",
  INFO: "green"
};
