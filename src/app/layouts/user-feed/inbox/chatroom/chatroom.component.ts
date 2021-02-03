import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  @Input() chatFeeds: any;

  constructor() { }

  ngOnInit(): void {
  }

}
