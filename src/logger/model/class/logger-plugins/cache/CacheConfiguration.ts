import { LoggerConfig } from "./../../../../model/interfaces/logger-config.interface";

export interface CacheConfiguration {
  activateCache: boolean;
  maxStackSize: number;
}

export type LoggerWithCaching = LoggerConfig<{ cache: CacheConfiguration }>
