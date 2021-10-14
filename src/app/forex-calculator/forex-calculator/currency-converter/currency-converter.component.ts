import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { tap, switchMapTo, startWith, map } from 'rxjs/operators';
import { ForexCalculatorService } from '../../forex-calculator.service';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.css', '../forex-calculator.component.css']
})
export class CurrencyConverterComponent implements OnInit {
  //options for select
  currencies = this.service.getAccountCurrencyOptions

  // controls
  currencyFromCtrl = new FormControl(this.currencies[0].value)
  currencyToCtrl = new FormControl(this.currencies[0].value)
  amountCtrl = new FormControl(100000)
  currencyConversionPriceCtrl = new FormControl(0)


  rates: any
  result: any = ""

  currencyIcon$ = this.currencyToCtrl.valueChanges.pipe(
    startWith(this.currencyToCtrl.value),
    map(val => this.service.getCurrencyIcons(val))
  )
  constructor(
    private service: ForexCalculatorService
  ) { }

  ngOnInit(): void {
    this.service.getRates().pipe(
      tap(rates => {
        this.rates = rates;

      }),
      switchMapTo(combineLatest([
        this.currencyFromCtrl.valueChanges.pipe(startWith(this.currencyFromCtrl.value)),
        this.currencyToCtrl.valueChanges.pipe(startWith(this.currencyToCtrl.value)),
        this.amountCtrl.valueChanges.pipe(startWith(this.amountCtrl.value))
      ]))
    )
      .subscribe(([currencyFrom, currencyTo, amount]) => {
        const currencyExchange = this.rates[currencyTo] / this.rates[currencyFrom]
        this.currencyConversionPriceCtrl.setValue(currencyExchange);
        this.result = this.service.convertCurrency(currencyFrom, currencyTo, amount, currencyExchange)
      })

  }

}
