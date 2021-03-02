import { UUID } from 'angular2-uuid';
import { SeverityColors } from '../../interfaces/severity-color.interface';
import { LOGGER_CONFIG } from '../../../constants/logger-config';
import { LogLevel } from '../../../enums/log-level.enum';
import { LoggerConfig } from '../../interfaces/logger-config.interface';

export abstract class BaseLogItem {
  // getTime() always uses UTC for time representation.
  // For example, a client browser in one timezone, getTime() will be the same as a client browser in any other timezone.
  id = UUID.UUID();
  timestamp = (new Date()).getTime();
  trace: any[] = [];
  #config!: LoggerConfig;

  abstract nativeLogImp(): void;

  protected get logTemplate(): string[] {
    return [`%c` + this.severity + ' LOG', `${this.cssStyle}`];
  }

  protected get cssStyle(): string {
    return `
    color:${this.color};
    font-size:12px;
    font-weight:bolder;
    background-color:white;
    padding:2px 5px;
    `;
  }

  protected get color(): string {
    return this.#config.colors?.[this.severity];
  }

  get severity(): keyof SeverityColors {
    return <keyof SeverityColors>LogLevel[this.level];
  }

  protected constructor(public description: string,
                        public category: string = 'code_origin',
                        public level: number,
                        loggerConfig?: LoggerConfig) {
    this.#config = loggerConfig || LOGGER_CONFIG;
    this.nativeLog();
  }

  protected nativeLog(): void {
    if (this.#config?.nativeLog) {
      this.nativeLogImp();
    }
  }
}
