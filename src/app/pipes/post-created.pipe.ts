import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'postCreated'
})
export class PostCratedPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    let date: any = new Date(value);
    let postDate = date.getDate();
    let postMonth = date.toLocaleString('default', { month: 'short' });
    let postYear = date.getFullYear();

    let currDate: any = new Date();
    var hours = Math.abs(currDate - date) / 36e5;

    if(hours <= 24) {
      return hours.toFixed(0) + "h";
    }
    return postDate + " " + postMonth + " " + postYear;
  }

}
