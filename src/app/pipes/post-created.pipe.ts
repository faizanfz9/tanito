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
    let diff = Math.abs(currDate - date)
    let hours = diff / 36e5;
    let minutes = Math.floor((diff/1000)/60);

    if(minutes == 0) {
      return "Just now";
    }
    if(hours < 1) {
      if(minutes == 1) {
        return minutes + " minute ago";
      }
      return minutes + " minutes ago";
    }
    if(hours <= 24) {
      return hours.toFixed(0) + "h ago";
    }
    return postDate + " " + postMonth + " " + postYear;
  }

}
