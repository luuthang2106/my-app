import { Component, OnInit } from '@angular/core';
import { ForexCalculatorService } from '../../forex-calculator.service';
import { FormControl } from '@angular/forms';
import { map, startWith, switchMap, switchMapTo, takeUntil, tap } from 'rxjs/operators';
import { combineLatest, Subject } from 'rxjs';

@Component({
  selector: 'app-profit-calculator',
  templateUrl: './profit-calculator.component.html',
  styleUrls: ['./profit-calculator.component.css', '../forex-calculator.component.css']
})
export class ProfitCalculatorComponent implements OnInit {
  destroy$ = new Subject();
  currencyPairOptions = this.service.getCurrencyPair
  currencies = this.service.getAccountCurrencyOptions
  dailyOpenClosePrices: any[] = []
  result: any = ""
  rates: any = []

  currencyPairCtrl = new FormControl(this.currencyPairOptions[0].value)
  buyOrSellCtrl = new FormControl(true)
  openPriceCtrl = new FormControl()
  closePriceCtrl = new FormControl()
  tradeSizeCtrl = new FormControl(1)
  depositCurrencyCtrl = new FormControl(this.currencies[0].value)

  currencyToCtrl: any;
  constructor(
    private service: ForexCalculatorService
  ) { }

  ngOnInit(): void {
    this.service.getDailyOpenClosePrice().subscribe(result => {
      if (result.length > 0) {
        this.dailyOpenClosePrices = [...result]
      }
      this.onChangeCurrencyPair(this.currencyPairCtrl.value)
      this.currencyPairCtrl.setValue(this.currencyPairCtrl.value)
    })


    combineLatest([
        this.currencyPairCtrl.valueChanges.pipe(startWith(this.currencyPairCtrl.value)),
        this.buyOrSellCtrl.valueChanges.pipe(startWith(this.buyOrSellCtrl.value)),
        this.tradeSizeCtrl.valueChanges.pipe(startWith(this.tradeSizeCtrl.value)),
        this.depositCurrencyCtrl.valueChanges.pipe(startWith(this.depositCurrencyCtrl.value)),
      ])
    .pipe(
      switchMap(values =>  this.service.getRates().pipe(
        tap(rates => {
          this.rates = rates;
        }),
        map(_ => values)
      )),
      takeUntil(this.destroy$)
    )
      .subscribe(([currencyPair, buyOrSell, tradeSize, depositCurrency]) => {
        this.onChangeCurrencyPair(currencyPair)
        const openPrice = this.openPriceCtrl.value
        const closePrice = this.closePriceCtrl.value
        const currencyExchange = this.rates[depositCurrency] / this.rates[currencyPair.split('/')[0]]
        this.result = this.service.calculateProfit(openPrice, closePrice, tradeSize, buyOrSell, currencyExchange)
      })
  }

  onChangeCurrencyPair(currencyPair) {
    const value = `${currencyPair.split('/')[0]}${currencyPair.split('/')[1]}`
    const foundResult = this.dailyOpenClosePrices.find((item: any) => item.T === `C:${value}`)
    if (foundResult) {
      this.openPriceCtrl.setValue(foundResult.o)
      this.closePriceCtrl.setValue(foundResult.c)
    } else {
      this.openPriceCtrl.setValue(0)
      this.closePriceCtrl.setValue(0)
    }
  }
}
