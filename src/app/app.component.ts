import { Component, Inject, VERSION } from "@angular/core";
import { LOGGER_CONFIG } from "../logger/constants/logger-config";
import { LoggerToken } from "../logger/logger.module";
import { LoggerFactory } from '../logger/logger.class';

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  name = "Angular " + VERSION.major;
  constructor(@Inject(LoggerToken) private logger: LoggerFactory) {
    this.logger.logInfo("customized logger's scope - pink");
    // =========================. Changing the root config .=============================
    const globalConfig = LoggerFactory.getGlobalConfig()
    LoggerFactory.setGlobalConfig({ colors: { ERROR: "red", WARN: "red", INFO: "red" } });
    LoggerFactory.info("red");
    // =========================. Customize logs colors in a local's logger .=============================================
    let localLogger = LoggerFactory.create({ colors: { ERROR: "red", WARN: "orange", INFO: "blue" } });
    localLogger.logInfo("blue");
    LoggerFactory.info(" red");
    // =========================.Changing the root config , will not effect the local scope config  .=============================
    // =========================. But will effect any new logger's instances  that will be created - .============================
    localLogger = LoggerFactory.create({ ...globalConfig, reportOnly: globalConfig.reportOnly });
    localLogger.logInfo("still pink");
    // =========================. 4 .=============================
  }
}
