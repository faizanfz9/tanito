import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'recentPost'
})
export class RecentPostPipe implements PipeTransform {

  transform(posts: any[]): any {
    return posts.sort((a: any, b: any) => {
      let postB: any = new Date(b.created);
      let postA: any = new Date(a.created);
      // console.log(posts.indexOf(a), posts.indexOf(b));
      return postB - postA;
    })
  }

}

