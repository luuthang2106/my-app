import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { startWith, switchMapTo, tap } from 'rxjs/operators';
import { ForexCalculatorService } from '../../forex-calculator.service';

@Component({
  selector: 'app-pip-calculator',
  templateUrl: './pip-calculator.component.html',
  styleUrls: ['./pip-calculator.component.css', '../forex-calculator.component.css']
})
export class PipCalculatorComponent implements OnInit {
  accountCurrencyOptions = this.service.getAccountCurrencyOptions
  currencyPairOptions = this.service.getCurrencyPair

  rates: any
  pipValue = ""

  accountCurrencyCtrl = new FormControl(this.accountCurrencyOptions[0].value)
  currencyPairCtrl = new FormControl(this.currencyPairOptions[0].value)
  tradeSizeCtrl = new FormControl(100000)
  currencyConversionPriceCtrl = new FormControl(0)

  constructor(
    private service: ForexCalculatorService
  ) { }

  ngOnInit(): void {
    this.service.getRates().pipe(
      tap(rates => {
        this.rates = rates;

      }),
      switchMapTo(combineLatest([
        this.accountCurrencyCtrl.valueChanges.pipe(startWith(this.accountCurrencyCtrl.value)),
        this.currencyPairCtrl.valueChanges.pipe(startWith(this.currencyPairCtrl.value)),
        this.tradeSizeCtrl.valueChanges.pipe(startWith(this.tradeSizeCtrl.value))
      ]))
    )
      .subscribe(([accountCurrency, currencyPair, tradeSize]) => {
        const currencyExchange = this.rates[currencyPair.split('/')[1]] / this.rates[accountCurrency]
        this.currencyConversionPriceCtrl.setValue(currencyExchange);
        this.pipValue = this.service.calculatePipValue(accountCurrency, currencyPair, tradeSize, currencyExchange)
      })
  }

}
