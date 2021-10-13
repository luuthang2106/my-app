import { Component, OnInit } from '@angular/core';
import { ForexCalculatorService } from '../../forex-calculator.service';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.css']
})
export class CurrencyConverterComponent implements OnInit {

  constructor(
    private service: ForexCalculatorService
  ) { }

  ngOnInit(): void {
    console.log('init 2');
    this.service.getRates().subscribe()
  }

}
