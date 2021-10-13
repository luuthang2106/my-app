import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';

interface Option {
  value: string;
  label: string;
}

@Injectable()
export class ForexCalculatorService {
  private accessApiKey = "c19cbb58fdd1f24847fed4403ac52c21";

  ONE_PIP_DENOMINATOR = {
    CZK: 0.001,
    HUF: 0.01,
    JPY: 0.01,
  };

  ONE_PIP_NUMERATOR = {
    XAG: 0.0001,
    XAU: 0.01,
    XPD: 0.1,
    XPT: 0.1,
    XBR: 0.1,
    XNG: 0.001,
    XTI: 0.1,
  };
  constructor(
    private http: HttpClient
  ) { }
  //base: EUR
  getRates(): Observable<any> {
    return this.http.get(`http://data.fixer.io/api/latest?access_key=${this.accessApiKey}`).pipe(
      map((response: any) => response.rates),
      share())
  }

  calculatePipValue(accountCurrency, currencyPair, tradeLots, currencyExchange) {
    const onePip = this.ONE_PIP_DENOMINATOR[currencyPair.split('/')[1]] || this.ONE_PIP_NUMERATOR[currencyPair.split('/')[0]] || 0.0001;
    if (accountCurrency === currencyPair.split('/')[1]) {
      let pipValue: number = onePip * (tradeLots / 1)
      if (currencyPair === 'XAG/AUD' || currencyPair === 'XAG/USD') {
        pipValue *= 10;
      }

      if (currencyPair === 'XTI/USD' || currencyPair === 'XBR/USD') {
        pipValue /= 10;
      }
      return pipValue.toFixed(2)
    } else {
      let pipValue = onePip * (tradeLots / currencyExchange);
      if (currencyPair === 'XAG/AUD' || currencyPair === 'XAG/USD') {
        pipValue *= 10;
      }

      if (currencyPair === 'XTI/USD' || currencyPair === 'XBR/USD') {
        pipValue /= 10;
      }
      return pipValue.toFixed(2)
    }
  }

  get getAccountCurrencyOptions(): Option[] {
    return [
      {
        label: "AUD",
        value: "AUD"
      },
      {
        label: "USD",
        value: "USD"
      },
      {
        label: "EUR",
        value: "EUR"
      },
      {
        label: "CAD",
        value: "CAD"
      },
      {
        label: "GBP",
        value: "GBP"
      },
      {
        label: "SGD",
        value: "SGD"
      },
      {
        label: "NZD",
        value: "NZD"
      },
      {
        label: "JPY",
        value: "JPY"
      },
      {
        label: "CHF",
        value: "CHF"
      },
    ]
  }
  get getCalculatorOptions(): Option[] {
    return [
      {
        label: "Pip Calculator",
        value: "pipCalculator"
      },
      {
        label: "Currency Converter",
        value: "currencyConverter"
      },
      {
        label: "Margin Calculator",
        value: "marginCalculator"
      },
      {
        label: "Swaps Calculator",
        value: "swapsCalculator"
      },
      {
        label: "Profit Calculator",
        value: "profitCalculator"
      }
    ]
  }

  get getCurrencyPair(): Option[] {
    return [
      {
        label: "AUD/CAD",
        value: "AUD/CAD"
      },
      {
        label: "AUD/CHF",
        value: "AUD/CHF"
      },
      {
        label: "AUD/JPY",
        value: "AUD/JPY"
      },
      {
        label: "AUD/NZD",
        value: "AUD/NZD"
      },
      {
        label: "AUD/SGD",
        value: "AUD/SGD"
      },
      {
        label: "AUD/USD",
        value: "AUD/USD"
      },
      //
      {
        label: "CAD/CHF",
        value: "CAD/CHF"
      },
      {
        label: "CAD/JPY",
        value: "CAD/JPY"
      },
      //
      {
        label: "CHF/JPY",
        value: "CHF/JPY"
      },
      {
        label: "CHF/SGD",
        value: "CHF/SGD"
      },
      //
      {
        label: "EUR/AUD",
        value: "EUR/AUD"
      },
      {
        label: "EUR/CAD",
        value: "EUR/CAD"
      },
      {
        label: "EUR/CHF",
        value: "EUR/CHF"
      },
      {
        label: "EUR/DKK",
        value: "EUR/DKK"
      },
      {
        label: "EUR/CZK",
        value: "EUR/CZK"
      },
      {
        label: "EUR/GBP",
        value: "EUR/GBP"
      },
      {
        label: "EUR/HUF",
        value: "EUR/HUF"
      },
      {
        label: "EUR/JPY",
        value: "EUR/JPY"
      },
      {
        label: "EUR/MXN",
        value: "EUR/MXN"
      },
      {
        label: "EUR/NOK",
        value: "EUR/NOK"
      },
      {
        label: "EUR/NZD",
        value: "EUR/NZD"
      },
      {
        label: "EUR/PLN",
        value: "EUR/PLN"
      },
      {
        label: "EUR/SEK",
        value: "EUR/SEK"
      },
      {
        label: "EUR/SGD",
        value: "EUR/SGD"
      },
      {
        label: "EUR/TRY",
        value: "EUR/TRY"
      },
      {
        label: "EUR/USD",
        value: "EUR/USD"
      },
      {
        label: "EUR/ZAR",
        value: "EUR/ZAR"
      },
      //
      {
        label: "GBP/AUD",
        value: "GBP/AUD"
      },
      {
        label: "GBP/CAD",
        value: "GBP/CAD"
      },
      {
        label: "GBP/CHF",
        value: "GBP/CHF"
      },
      {
        label: "GBP/DKK",
        value: "GBP/DKK"
      },
      {
        label: "GBP/JPY",
        value: "GBP/JPY"
      },
      {
        label: "GBP/PLN",
        value: "GBP/PLN"
      },
      {
        label: "GBP/MXN",
        value: "GBP/MXN"
      },
      {
        label: "GBP/NZD",
        value: "GBP/NZD"
      },
      {
        label: "GBP/SEK",
        value: "GBP/SEK"
      },
      {
        label: "GBP/SGD",
        value: "GBP/SGD"
      },
      {
        label: "EUR/TRY",
        value: "EUR/TRY"
      },
      {
        label: "EUR/USD",
        value: "EUR/USD"
      },
      //
      {
        label: "NZD/CAD",
        value: "NZD/CAD"
      },
      {
        label: "NZD/CHF",
        value: "NZD/CHF"
      },
      {
        label: "NZD/JPY",
        value: "NZD/JPY"
      },
      {
        label: "NZD/SGD",
        value: "NZD/SGD"
      },
      {
        label: "NZD/USD",
        value: "NZD/USD"
      },
      //
      {
        label: "USD/CAD",
        value: "USD/CAD"
      },
      {
        label: "USD/CHF",
        value: "USD/CHF"
      },
      {
        label: "USD/CNH",
        value: "USD/CNH"
      },
      {
        label: "USD/CZK",
        value: "USD/CZK"
      },
      {
        label: "USD/DKK",
        value: "USD/DKK"
      },
      {
        label: "USD/HUF",
        value: "USD/HUF"
      },
      {
        label: "USD/JPY",
        value: "USD/JPY"
      },
      {
        label: "USD/MXN",
        value: "USD/MXN"
      },
      {
        label: "USD/NOK",
        value: "USD/NOK"
      },
      {
        label: "USD/PLN",
        value: "USD/PLN"
      },
      {
        label: "USD/RUB",
        value: "USD/RUB"
      },
      {
        label: "USD/SEK",
        value: "USD/SEK"
      },
      {
        label: "USD/SGD",
        value: "USD/SGD"
      },
      {
        label: "USD/THB",
        value: "USD/THB"
      },
      {
        label: "USD/TRY",
        value: "USD/TRY"
      },
      {
        label: "USD/ZAR",
        value: "USD/ZAR"
      },
      //
      {
        label: "XAU/USD",
        value: "XAU/USD"
      },
      {
        label: "XAU/AUD",
        value: "XAU/AUD"
      },
      //
      {
        label: "XAG/USD",
        value: "XAG/USD"
      },
      {
        label: "XAG/AUD",
        value: "XAG/AUD"
      },
      //
      {
        label: "XTI/USD",
        value: "XTI/USD"
      },
      //
      {
        label: "XBR/USD",
        value: "XBR/USD"
      },
    ]
  }
}
