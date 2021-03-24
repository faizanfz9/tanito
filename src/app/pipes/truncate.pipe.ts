import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: any, limit: any): any {
    let length = limit;
    let myString = value;
    if(myString.length > length) {
      return myString.substring(0,length) + "...";
    }
    return myString.substring(0,length);
  }

}
