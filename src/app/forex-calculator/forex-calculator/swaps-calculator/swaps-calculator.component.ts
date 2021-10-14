import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ForexCalculatorService } from '../../forex-calculator.service';

@Component({
  selector: 'app-swaps-calculator',
  templateUrl: './swaps-calculator.component.html',
  styleUrls: ['./swaps-calculator.component.css', '../forex-calculator.component.css']
})
export class SwapsCalculatorComponent implements OnInit {
  currencies = this.service.getAccountCurrencyOptions
  currencyPairOptions = this.service.getCurrencyPair

  result: any
  rates: any
  
  accountCurrencyCtrl = new FormControl(this.currencies[0].value)
  swapLongCtrl = new FormControl(this.currencies[0].value)
  currencyPairCtrl = new FormControl(this.currencyPairOptions[0].value)
  swapShortCtrl = new FormControl(100000)
  tradeSizeCtrl = new FormControl(100000)
  currencyConversionPriceCtrl = new FormControl(100000)
  constructor(private service: ForexCalculatorService) { }

  ngOnInit(): void {
  }

}
