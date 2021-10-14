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
  constructor(
    private http: HttpClient
  ) { }
  //base: EUR
  // get rates from fixer.io
  getRates(): Observable<any> {
    return this.http.get(`http://data.fixer.io/api/latest?access_key=${this.accessApiKey}`).pipe(
      map((response: any) => response.rates),
      share())
  }
  // products from https://www.fpmarkets.com/ca/forex-calculator/ (share margin calculator)
  getProducts(): Observable<any> {
    //[{"ALLIANZ.r":"196.48","BASF.r":"65.22","BAYER.r":"47.8","BMW.r":"86.37","BP.r":"3.585","COCACOLA.r":"54.68","DAIMLER.r":"83.09","DBANK.r":"11.07","DISNEY.r":"174.73","EXXON.r":"62.05","GOLDMAN.r":"390.5","GSK.r":"14.018","HSBC.r":"4.265","IBM.r":"143.82","INTEL.r":"53.91","JPMORGAN.r":"163.47","LLOYDS.r":"0.485","MASTERCARD.r":"344.18","MCDONALDS.r":"244.66","MICROSOFT.r":"302","NETFLIX.r":"634.52","NIKE.r":"157.32","NVIDIA.r":"216.51","RBS.r":"2.3","RIO.r":"51.2","SIEMENS.r":"141.24","STARBUCKS.r":"112.32","VISA.r":"225.07"}]
    return this.http.get(`https://calc.fpmarkets.com.cy/js/mt5products.json`).pipe(
      map((response: any) => {
        return response[0]
      }),
      share())
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
