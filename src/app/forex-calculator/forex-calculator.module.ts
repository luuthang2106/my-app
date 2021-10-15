import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { ForexCalculatorComponent } from './forex-calculator/forex-calculator.component';
import { PipCalculatorComponent } from './forex-calculator/pip-calculator/pip-calculator.component';
import { CurrencyConverterComponent } from './forex-calculator/currency-converter/currency-converter.component';
import { MarginCalculatorComponent } from './forex-calculator/margin-calculator/margin-calculator.component';
import { SwapsCalculatorComponent } from './forex-calculator/swaps-calculator/swaps-calculator.component';
import { ProfitCalculatorComponent } from './forex-calculator/profit-calculator/profit-calculator.component';
import { CurrencyIconComponent } from './currency-icon/currency-icon.component';
import { ResultOutputPipe } from './pipes/result-output.pipe';

@NgModule({
  declarations: [
    ForexCalculatorComponent,
    PipCalculatorComponent,
    CurrencyConverterComponent,
    MarginCalculatorComponent,
    SwapsCalculatorComponent,
    ProfitCalculatorComponent,
    CurrencyIconComponent,
    ResultOutputPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [ForexCalculatorComponent]
})
export class ForexCalculatorModule { }
