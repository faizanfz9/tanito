import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss']
})
export class FollowingComponent implements OnInit {
  following: any = [];
  loading = false;
  path: any;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    let user = JSON.parse(this.userService.getUser());
    let userId = new FormData();
    userId.append("user_id", user.id);
    this.loading = true;
    this.userService.getFollowing(userId).subscribe(res => {
      this.loading = false;
      this.path = res.data.urlkey;
      this.following = res.data.following;
    })
  }

}
