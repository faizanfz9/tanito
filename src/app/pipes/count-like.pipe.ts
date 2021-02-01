import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countLike'
})
export class CountLikePipe implements PipeTransform {

  transform(value: any): any {
    if(value != null) {
      return value.split(",").length;
    }else {
      return 0;
    }
  }

}
