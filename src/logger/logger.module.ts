import {
  ErrorHandler,
  InjectionToken,
  ModuleWithProviders,
  NgModule
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { LOGGER_CONFIG } from "./constants/logger-config";
import { ErrorLogger } from "./services/error-logger.interceptor";
import { LoggerFactory } from "./logger.class";
import { LoggerConfig } from "./model/interfaces/logger-config.interface";

export const LoggerToken: InjectionToken<LoggerFactory> = new InjectionToken<LoggerFactory>("LoggerToken");

@NgModule({
  imports: [CommonModule]
})
export class LoggerModule {
  static forRoot(config?: Partial<LoggerConfig>): ModuleWithProviders<LoggerModule> {
    return {
      ngModule: LoggerModule,
      providers: [{
        provide: ErrorHandler,
        useClass: ErrorLogger
      }, {
        provide: LoggerToken,
        useFactory: () => {
          const rootConfig: LoggerConfig = { ...LOGGER_CONFIG, ...config };
          LoggerFactory.setGlobalConfig(rootConfig);
          return LoggerFactory.create(rootConfig);
        }
      }
      ]
    };
  }

  static forChild(config: Partial<LoggerConfig>): ModuleWithProviders<LoggerModule> {
    return {
      ngModule: LoggerModule,
      providers: [
        {
          provide: LoggerToken,
          useFactory: function () {
            return LoggerFactory.create(config);
          }
        }
      ]
    };
  }
}
