import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-currency-icon',
  templateUrl: './currency-icon.component.html',
  styleUrls: ['./currency-icon.component.css']
})
export class CurrencyIconComponent {
  @Input() type: 'USD' | 'EUR' | 'GBP' | 'JPY';
  @Input() color: 'red' | 'black' = 'red';
}
