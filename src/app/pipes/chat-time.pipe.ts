import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chatTime'
})
export class ChatTimePipe implements PipeTransform {

  transform(value: any): any {
    const now = new Date(value);
    const time = now.toLocaleDateString() + " | " + now.getHours() + ':' + now.getMinutes();
    return time;
  }

}
