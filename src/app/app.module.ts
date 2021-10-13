import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ForexCalculatorModule } from './forex-calculator/forex-calculator.module';
import { ForexCalculatorService } from './forex-calculator/forex-calculator.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ForexCalculatorModule
  ],
  providers: [ForexCalculatorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
