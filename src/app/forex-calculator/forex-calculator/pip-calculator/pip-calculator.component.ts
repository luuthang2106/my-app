import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { map, startWith, switchMap, switchMapTo, takeUntil, tap } from 'rxjs/operators';
import { ForexCalculatorService } from '../../forex-calculator.service';

@Component({
  selector: 'app-pip-calculator',
  templateUrl: './pip-calculator.component.html',
  styleUrls: ['./pip-calculator.component.css', '../forex-calculator.component.css']
})
export class PipCalculatorComponent implements OnInit, OnDestroy {
  accountCurrencyOptions = this.service.getAccountCurrencyOptions
  currencyPairOptions = this.service.getCurrencyPair

  destroy$ = new Subject();
  rates: any
  pipValue = ""

  accountCurrencyCtrl = new FormControl(this.accountCurrencyOptions[2].value)
  currencyPairCtrl = new FormControl(this.currencyPairOptions[0].value)
  tradeSizeCtrl = new FormControl(100000)
  currencyConversionPriceCtrl = new FormControl(0)

  currencyIcon$ = this.accountCurrencyCtrl.valueChanges.pipe(
    startWith(this.accountCurrencyCtrl.value),
    map(val => this.service.getCurrencyIcons(val))
  )

  constructor(
    private service: ForexCalculatorService
  ) { }

  ngOnInit(): void {
    combineLatest([
      this.accountCurrencyCtrl.valueChanges.pipe(startWith(this.accountCurrencyCtrl.value)),
      this.currencyPairCtrl.valueChanges.pipe(startWith(this.currencyPairCtrl.value)),
      this.tradeSizeCtrl.valueChanges.pipe(startWith(this.tradeSizeCtrl.value))
    ])
    .pipe(
      switchMap(values => this.service.getRates().pipe(tap(rates => this.rates = rates), map(_ => values))),
      takeUntil(this.destroy$)
    )
    .subscribe(([accountCurrency, currencyPair, tradeSize]) => {
      const currencyExchange = this.rates[currencyPair.split('/')[1]] / this.rates[accountCurrency]
      this.currencyConversionPriceCtrl.setValue(currencyExchange);
      this.pipValue = this.service.calculatePipValue(accountCurrency, currencyPair, tradeSize, currencyExchange)
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
