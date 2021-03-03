import { MAX_STACK_SIZE } from '../../../../constants/constants';
import { LoggerConfig } from '../../../interfaces/logger-config.interface';
import { LoggerWithCaching } from './CacheConfiguration';
import { BaseLogItem } from '../../logger-types/base-log-item.class';
import { LoggerReporter } from '../logger-server-reporter';

export class CacheManager {
  private maxStackSize: number = MAX_STACK_SIZE;
  private cachedItems: null | BaseLogItem[] = null;
  private reporter: LoggerReporter = new LoggerReporter();
  // todo: which is a better option caching as:
  // 1. global & singleton
  // 2.  local instances & inherites from the global instance 
  // if so i need to create uniqeId by some repeatable logic, could be the URL that the log was emited (as key in the localStorage) / GroupBy Type (error/info etc ...) 
  private readonly UNREPORTED_LOGS = ` 'UNREPORTED_LOGS_${new Date().getMilliseconds()}`;

  /**
   * @description Activate the feature ( Log Caching )
   * if configured in the logger's {@link LoggerConfig | config } (activateCache:bool)
   * this method is being triggered from the {@link Logger.activate } method
   * @param config
   */
  constructor(config: LoggerWithCaching) {
    if (config.cache.activateCache) {
      this.trySendRetroLogs(config);
      this.setStackSize(config.cache.maxStackSize);
      this.onWindowUnloads();
    }
  }

  /**
   * Cached Items
   * Getting & parsing current cached logs from localStorage
   */
  getCachedItems(): null | BaseLogItem[] {
    if (!this.cachedItems) {
      const items: string | null = localStorage.getItem(this.UNREPORTED_LOGS);
      this.cachedItems = items ? JSON.parse(items) : null;
    }
    return this.cachedItems;
  }

  addItemToCache(origin: BaseLogItem): void {
    if (!this.isCleanNeeded()) {
      this.cleanCache();
    }
    const cachedItems = this.getCachedItems();
    cachedItems ? cachedItems?.push(origin) : this.cachedItems = [origin];
  }

  /**
   * On Window Unloads
   * @description before exits the application (window)
   * local cached items get saved in the localStorage
   * @private
   */
  private onWindowUnloads(): void {
    window.addEventListener('beforeunload', () => {
      const cachedItems = this.getCachedItems();
      if (cachedItems) {
        localStorage.setItem(this.UNREPORTED_LOGS, JSON.stringify(cachedItems));
      }
    }, { once: true });
  }

  private isCleanNeeded(): null | boolean {
    const baseLogItems = this.getCachedItems();
    return baseLogItems && baseLogItems?.length + 1 < this.maxStackSize;
  }

  private trySendRetroLogs(config: LoggerConfig): void {
    const cachedItems = this.getCachedItems();
    if (cachedItems && config.reportOnly.length) {
      Promise.all(cachedItems.map((item: BaseLogItem) => this.reporter.report(item, config)))
    }
  }

  private cleanCache(): void {
    localStorage.removeItem(this.UNREPORTED_LOGS);
    this.cachedItems = null;
  }

  private setStackSize(maxStackSize: number = MAX_STACK_SIZE): void {
    this.maxStackSize = maxStackSize;
  }

  static typeGuard(config: LoggerConfig | LoggerWithCaching): config is LoggerWithCaching {
    return 'cache' in config
  }
}

