import type { BaseLogItem, } from "../logger-types";
import { ErrorLogItem } from "../logger-types";
import { LoggerConfig } from '../../interfaces/logger-config.interface';
import { LoggerWithCaching } from "./cache/CacheConfiguration";

export class LoggerReporter {
    private async sendToServer(logItem: BaseLogItem | BaseLogItem[], config: LoggerConfig): Promise<ErrorLogItem | any> {
        try {
            const response = await fetch(
                config.apiPath,
                {
                    method: 'POST',
                    headers: {
                        Authorization: config.authorization!,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(logItem)
                });
            return response.json();
        } catch (e) {
            return ErrorLogItem.toErrorItem(e, config);
        }
    }

    async report(logItem: BaseLogItem, config: LoggerConfig | LoggerWithCaching): Promise<ErrorLogItem | null | any> {
        return await (config.reportOnly?.includes(logItem.level) ? this.sendToServer(logItem, config) : null);
    }
}