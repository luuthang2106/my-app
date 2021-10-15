import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { tap, switchMapTo, startWith, map, takeUntil, switchMap } from 'rxjs/operators';
import { ForexCalculatorService } from '../../forex-calculator.service';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.css', '../forex-calculator.component.css']
})
export class CurrencyConverterComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  //options for select
  currencies = this.service.getAccountCurrencyOptions

  // controls
  currencyFromCtrl = new FormControl(this.currencies[0].value)
  currencyToCtrl = new FormControl(this.currencies[0].value)
  amountCtrl = new FormControl(100000)
  currencyConversionPriceCtrl = new FormControl(0)


  rates: any
  result: any = ""

  constructor(
    private service: ForexCalculatorService
  ) { }

  ngOnInit(): void {
    combineLatest([
      this.currencyFromCtrl.valueChanges.pipe(startWith(this.currencyFromCtrl.value)),
      this.currencyToCtrl.valueChanges.pipe(startWith(this.currencyToCtrl.value)),
      this.amountCtrl.valueChanges.pipe(startWith(this.amountCtrl.value))
    ])
    .pipe(
      switchMap(values => this.service.getRates().pipe(
        tap(rates => {
          this.rates = rates;

        }),
        map(_ => values)
      )),
      takeUntil(this.destroy$)
    )
      .subscribe(([currencyFrom, currencyTo, amount]) => {
        const currencyExchange = this.rates[currencyTo] / this.rates[currencyFrom]
        this.currencyConversionPriceCtrl.setValue(currencyExchange);
        this.result = this.service.convertCurrency(currencyFrom, currencyTo, amount, currencyExchange)
      })

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
