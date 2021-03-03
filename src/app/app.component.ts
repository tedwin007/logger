import { Component, Inject, VERSION } from "@angular/core";
import { LoggerToken } from "../logger/logger.module";
import { Logger } from '../logger/logger.class';

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  constructor(@Inject(LoggerToken) private logger: Logger) {
    this.logger.logInfo("customized logger's scope - pink");
    // =========================. Changing the root config .=============================
    const globalConfig = Logger.getGlobalConfig()
    Logger.setGlobalConfig({ colors: { ERROR: "red", WARN: "red", INFO: "red" } });
    Logger.info("red");
    // =========================. Customize logs colors in a local's logger .=============================================
    let localLogger = Logger.create({ colors: { ERROR: "red", WARN: "orange", INFO: "blue" } });
    localLogger.logInfo("blue");
    Logger.info(" red");
    // =========================.Changing the root config , will not effect the local scope config  .=============================
    // =========================. But will effect any new logger's instances  that will be created - .============================
    localLogger = Logger.create({ ...globalConfig, reportOnly: globalConfig.reportOnly });
    localLogger.logInfo("still pink");
    // =========================. 4 .=============================
  }
}
