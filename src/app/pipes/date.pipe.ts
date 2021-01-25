import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datefilter'
})
export class DatePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    return value.slice(0, value.indexOf(" "));
  }

}
