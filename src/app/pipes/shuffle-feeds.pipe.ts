import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shuffleFeeds'
})
export class ShuffleFeedsPipe implements PipeTransform {

  transform(items: any[]): any {
    let feeds = items;
    for (var i = feeds.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = feeds[i];
      feeds[i] = feeds[j];
      feeds[j] = temp;
    }
    return feeds;
  }

}
