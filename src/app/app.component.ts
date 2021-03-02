import { Component, Inject, VERSION } from "@angular/core";
import { LOGGER_CONFIG } from "../logger/constants/logger-config";
import { LoggerToken } from "../logger/logger.module";
import { Logger, LoggerInstance } from "../logger/model";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  name = "Angular " + VERSION.major;
  constructor(@Inject(LoggerToken) private logger: LoggerInstance) {
    this.logger.logInfo("customized logger's scope - pink");
    // =========================. 1 .=============================
    // customize logger config inside a local's logger scope
    const tempLog = Logger.create({
      colors: {
        ERROR: "red",
        WARN: "orange",
        INFO: "blue"
      }
    });
    tempLog.logInfo("Changed color for 'info' (tempLog) log- blue");
    Logger.info("Changed color for 'info' (tempLog) log - still pink");
    // =========================. 2 .=============================
    // Changing the root config
    Logger.setRootConfig({
      ...LOGGER_CONFIG,
      colors: {
        ERROR: "red",
        WARN: "red",
        INFO: "red"
      }
    });
    Logger.info("red");
    // =========================. 3 .=============================
    this.logger.logInfo(
      "Changing the root config , did not effect the local scope config - still pink"
    );
    Logger.create({
      colors: {
        ERROR: "purple",
        WARN: "purple",
        INFO: "purple"
      }
    }).logInfo(
      "But will effect any new logger's instances  that will be created - purple"
    );
    // =========================. 4 .=============================
  }
}
