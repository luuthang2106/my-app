import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'resultouput'
})
export class ResultOutputPipe implements PipeTransform {
  transform(value: string) {
    value = value.toString();

    return value.indexOf('-') > -1 ? value.substring(0, 9) : value.substring(0, 8)
  }
}
