import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { LoggerModule } from "../logger/logger.module";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    LoggerModule.forRoot({
      nativeLog: true,
      reportOnly: [],
      colors: {
        ERROR: "red",
        WARN: "orange",
        INFO: "pink"
      }
    })
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
