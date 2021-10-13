import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ForexCalculatorComponent } from './forex-calculator/forex-calculator.component';
import { PipCalculatorComponent } from './forex-calculator/pip-calculator/pip-calculator.component';
import { CurrencyConverterComponent } from './forex-calculator/currency-converter/currency-converter.component';
import { MarginCalculatorComponent } from './forex-calculator/margin-calculator/margin-calculator.component';
import { SwapsCalculatorComponent } from './forex-calculator/swaps-calculator/swaps-calculator.component';
import { ProfitCalculatorComponent } from './forex-calculator/profit-calculator/profit-calculator.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    ForexCalculatorComponent,
    PipCalculatorComponent,
    CurrencyConverterComponent,
    MarginCalculatorComponent,
    SwapsCalculatorComponent,
    ProfitCalculatorComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [ForexCalculatorComponent]
})
export class ForexCalculatorModule { }
