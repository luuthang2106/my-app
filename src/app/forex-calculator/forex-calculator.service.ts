import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';

interface Option {
  value: any;
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


  // use in calculate share magin
  shareLeverage_5 = ["SHELL", "BP", "GSK", "HSBC", "RIO", "STDCHART", "RBS", "LLOYDS", "VODAPHONE", "CISCO", "STARBUCKS", "INTEL", "APPLE", "MICROSOFT", "COMCAST", "ADOBE", "GOOGLE", "AMAZON", "EXXON", "CHEVRON", "MCDONALDS", "BOA", "HOMEDEPOT", "WALMART", "COCACOLA", "AMEX", "JPMORGAN", "VERIZON", "CATERPILLAR", "IBM", "BOEING", "COCACOLA", "AMEX", "JPMORGAN", "VERIZON", "CATERPILLAR", "IBM", "BOEING"]
  // use in calculate share magin
  shareLeverage_10 = ["NVIDIA", "PEPSI", "NETFLIX", "FACEBOOK", "VISA", "NIKE", "AT&T", "MASTERCARD", "ORACLE", "WELLSFARGO", "PFIZER", "SAP", "GOLDMAN", "DISNEY", "DAIMLER", "BAYER", "BASF", "ALLIANZ", "VOLKSWAGON", "BMW", "ADIDAS", "DBANK", "SIEMENS"]
  // use in calculate share magin
  shareLeverageMargin = [
    {
      label: "1:5",
      value: 20
    },
    {
      label: "1:10",
      value: 10
    },
    {
      label: "1:20",
      value: 5
    },
  ]

  constructor(
    private http: HttpClient
  ) { }
  yesterday = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24)


  //base: EUR
  // get rates from fixer.io
  getRates(): Observable<any> {
    return this.http.get(`http://data.fixer.io/api/latest?access_key=${this.accessApiKey}`).pipe(
      map((response: any) => response.rates)
    )
  }
  // products from https://www.fpmarkets.com/ca/forex-calculator/ (share margin calculator)
  getProducts(): Observable<any> {
    return this.http.get(`https://calc.fpmarkets.com.cy/js/mt5products.json`).pipe(
      map((response: any) => {
        return response[0]
      }))
  }
  // Get the daily open, high, low, and close (OHLC) for the entire forex markets.
  getDailyOpenClosePrice() {
    return this.http.get(`https://api.polygon.io/v2/aggs/grouped/locale/global/market/fx/${this.yesterday.toISOString().slice(0, 10)}?adjusted=true&apiKey=ifjppKMJMIjcI3N5vsiwQ6Eo32rahGVf`).pipe(
      map((response: any) => {
        //array [
        //    {
        // T: "C:NOKUSD"
        // c: 0.118687
        // h: 0.118723
        // l: 0.11808048
        // n: 15699
        // o: 0.118191
        // t: 1634342399999
        // v: 15699
        // }
        // ]
        return response.results
      }),
      share()
    )
  }
  calculateProfit(openPrice, closePrice, tradeSize, isBuy, exchange) {
    if (isBuy) {
      return (closePrice - openPrice) * (exchange) * (tradeSize * 100000)
    } else {
      return (openPrice - closePrice) * (exchange) * (tradeSize * 100000)
    }
  }
  calculateShareMargin(sharePrice, leverage, lotSize) {
    return ((lotSize * sharePrice * leverage) / 100).toFixed(2)
  }
  calculateMargin(leverage, exchange, tradeSize) {
    return (tradeSize * exchange / parseInt(leverage)).toFixed(2)
  }
  getTradeSize(currencyA, currencyB) {
    const exceptionalTradeLots = {
      XAU: 100,
      XAG: 5000,
      XTI: 1000,
      XBR: 1000,
    };

    if (exceptionalTradeLots[currencyA] !== undefined) {
      return exceptionalTradeLots[currencyA];
    } else if (exceptionalTradeLots[currencyB] !== undefined) {
      return exceptionalTradeLots[currencyB];
    }
    return 100000;
  }
  // convert currency
  convertCurrency(from, to, amount, exchange) {
    if (from === to) {
      return 1
    } else {
      return (amount * exchange).toFixed(2)
    }
  }

  // calculate pip value
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

  // use in calculate magin
  get leverageMargin(): Option[] {
    return [
      {
        label: "1:500",
        value: 500
      },
      {
        label: "1:400",
        value: 400
      },
      {
        label: "1:300",
        value: 300
      },
      {
        label: "1:200",
        value: 200
      },
      {
        label: "1:100",
        value: 100
      },
      {
        label: "1:50",
        value: 50
      },
      {
        label: "1:30",
        value: 30
      },
      {
        label: "1:25",
        value: 25
      },
      {
        label: "1:1",
        value: 1
      },
    ]
  }
  get getAccountCurrencyOptions(): Option[] {
    return [
      {
        label: "AUD",
        value: "AUD",
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
      // {
      //   label: "Swaps Calculator",
      //   value: "swapsCalculator"
      // },
      {
        label: "Profit Calculator",
        value: "profitCalculator"
      }
    ]
  }

  // options for currency pairs
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

  // map to icon when change currency
  getCurrencyIcons(unit: string): string {
    switch (unit) {
      case 'USD':
        return 'fas fa-dollar-sign';
      case 'EUR':
        return 'fas fa-euro-sign';
      default:
        return 'fas fa-coins'
    }
  }
}
