import { BaseLogItem } from './logger-types';
import { LoggerUtils } from '../logger-utils';
import { MAX_STACK_SIZE } from '../../constants/constants';
import { LoggerConfig } from '../interfaces/logger-config.interface';

export abstract class LoggerCacheManger {
  private static maxStackSize: number = MAX_STACK_SIZE;
  private static cachedItems: null | BaseLogItem[] = null;
  private static readonly UNREPORTED_LOGS = 'UNREPORTED_LOGS';

  /**
   * Init Caching
   * @description Activate the feature ( Log Caching )
   * if configured in the logger's {@link LoggerConfig | config } (activateCache:bool)
   * this method is being triggered from the {@link Logger.activate } method
   * @param config
   */
  static initCaching(config: LoggerConfig): void {
    this.trySendRetroLogs(config);
    LoggerCacheManger.setStackSize(config.cache.maxStackSize);
    LoggerCacheManger.onWindowUnloads();
  }

  /**
   * Cached Items
   * Getting & parsing current cached logs
   * from localStorage
   */
  static getCachedItems(): null | BaseLogItem[] {
    if (!LoggerCacheManger.cachedItems) {
      const items: string | null = localStorage.getItem(LoggerCacheManger.UNREPORTED_LOGS);
      LoggerCacheManger.cachedItems = items ? JSON.parse(items) : null;
    }
    return LoggerCacheManger.cachedItems;
  }

  protected static addItemToCache(origin: BaseLogItem): void {
    if (!LoggerCacheManger.isCleanNeeded()) {
      LoggerCacheManger.cleanCache();
    }
    const cachedItems = LoggerCacheManger.getCachedItems();
    cachedItems ? cachedItems?.push(origin) : LoggerCacheManger.cachedItems = [origin];
  }

  /**
   * On Window Unloads
   * @description before exits the application (window)
   * local cached items get saved in the localStorage
   * @private
   */
  private static onWindowUnloads(): void {
    window.addEventListener('beforeunload', () => {
      const cachedItems = LoggerCacheManger.getCachedItems();
      if (cachedItems) {
        localStorage.setItem(LoggerCacheManger.UNREPORTED_LOGS, JSON.stringify(cachedItems));
      }
    }, {once: true});
  }

  private static isCleanNeeded(): null | boolean {
    const baseLogItems = LoggerCacheManger.getCachedItems();
    return baseLogItems && baseLogItems?.length + 1 < LoggerCacheManger.maxStackSize;
  }

  private static trySendRetroLogs(config: LoggerConfig): void {
    const cachedItems = LoggerCacheManger.getCachedItems();
    if (cachedItems) {
      LoggerUtils.sendToServer(cachedItems, config);
    }
  }

  private static cleanCache(): void {
    localStorage.removeItem(LoggerCacheManger.UNREPORTED_LOGS);
    LoggerCacheManger.cachedItems = null;
  }

  private static setStackSize(maxStackSize: number = MAX_STACK_SIZE): void {
    LoggerCacheManger.maxStackSize = maxStackSize;
  }
}

