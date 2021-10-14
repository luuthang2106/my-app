import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ForexCalculatorService } from '../forex-calculator.service';

interface Option {
  value: string;
  label: string;
}

@Component({
  selector: 'app-forex-calculator',
  templateUrl: './forex-calculator.component.html',
  styleUrls: ['./forex-calculator.component.css']
})
export class ForexCalculatorComponent implements OnInit {
  options: Option[] = this.service.getCalculatorOptions;

  type = new FormControl(this.options[0].value);
  constructor(
    private service: ForexCalculatorService
  ) { }

  ngOnInit(): void {
  }

}
