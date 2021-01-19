import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-user-timeline',
  templateUrl: './user-timeline.component.html',
  styleUrls: ['./user-timeline.component.scss']
})
export class UserTimelineComponent implements OnInit {
  user: any;

  constructor(private userService: UserService) { 
    this.user = JSON.parse(this.userService.getUser());
  }

  ngOnInit(): void {
  }

}
