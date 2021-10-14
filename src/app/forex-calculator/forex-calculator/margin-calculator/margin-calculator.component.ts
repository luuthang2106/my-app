import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { tap, switchMapTo, startWith, map } from 'rxjs/operators';
import { ForexCalculatorService } from '../../forex-calculator.service';

@Component({
  selector: 'app-margin-calculator',
  templateUrl: './margin-calculator.component.html',
  styleUrls: ['./margin-calculator.component.css', '../forex-calculator.component.css']
})
export class MarginCalculatorComponent implements OnInit {
  // options for select in form
  currencies = this.service.getAccountCurrencyOptions
  currencyPairOptions = this.service.getCurrencyPair
  leverageOptions = this.service.leverageMargin
  shareOptions = [...this.service.shareLeverage_10, ...this.service.shareLeverage_5].sort((a, b) => a.localeCompare(b))
  shareLeverageOptions = this.service.shareLeverageMargin
  products: any = null

  // control tab visible
  tab: boolean = true

  result: any = ""
  rates: any

  // form controls
  accountCurrencyCtrl = new FormControl(this.currencies[0].value)
  leverageCtrl = new FormControl(this.leverageOptions[0].value)
  currencyPairCtrl = new FormControl(this.currencyPairOptions[0].value)
  tradeSizeCtrl = new FormControl(100000)
  currencyPriceCtrl = new FormControl(0)
  sharesCtrl = new FormControl(this.shareOptions[0])
  sharePriceCtrl = new FormControl(0)

  currencyIcon$ = this.accountCurrencyCtrl.valueChanges.pipe(
    startWith(this.accountCurrencyCtrl.value),
    map(val => this.service.getCurrencyIcons(val))
  )
  constructor(
    private service: ForexCalculatorService
  ) { }

  ngOnInit(): void {
    this.service.getProducts().subscribe(productsObject => {
      this.products = productsObject
    })
    this.service.getRates().pipe(
      tap(rates => {
        this.rates = rates;
      }),
      switchMapTo(combineLatest([
        this.accountCurrencyCtrl.valueChanges.pipe(startWith(this.accountCurrencyCtrl.value)),
        this.leverageCtrl.valueChanges.pipe(startWith(this.leverageCtrl.value)),
        this.currencyPairCtrl.valueChanges.pipe(startWith(this.currencyPairCtrl.value)),
        this.tradeSizeCtrl.valueChanges.pipe(startWith(this.tradeSizeCtrl.value)),
        this.sharesCtrl.valueChanges.pipe(startWith(this.sharesCtrl.value)),
      ]))
    )
      .subscribe(([accountCurrency, leverage, currencyPair, tradeSize, shares]) => {
        // margin
        const currencyPrice = this.rates[accountCurrency] / this.rates[currencyPair.split('/')[0]]
        this.currencyPriceCtrl.setValue(this.rates[currencyPair.split('/')[1]] / this.rates[currencyPair.split('/')[0]]);

        // shareMargin 
        const sharePrice = this.getShareValue(shares)
        this.sharePriceCtrl.setValue(sharePrice)

        if (this.tab) {
          // for margin 
          this.result = this.service.calculateMargin(leverage, currencyPrice, tradeSize)
        } else {
          // for share margin
          this.result = this.service.calculateShareMargin(sharePrice, leverage, tradeSize)
        }
      })

  }

  changeTab(bool) {
    this.tab = bool
    // set value again
    bool ? this.leverageCtrl.setValue(this.leverageOptions[0].value) : this.leverageCtrl.setValue(this.shareLeverageOptions[0].value)
    bool ? this.tradeSizeCtrl.setValue(100000) : this.tradeSizeCtrl.setValue(1)
  }

  getShareValue(shareName) {
    if (this.products) {
      if (this.products[`${shareName}.r`] !== undefined) {
        return parseFloat(this.products[`${shareName}.r`]);
      } else {
        return parseFloat(this.products[`ALLIANZ.r`]);
      }
    }
    return 0
  }
}
