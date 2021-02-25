import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss']
})
export class FollowersComponent implements OnInit {
  followers: any = [];
  loading = false;
  path: any;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    let user = JSON.parse(this.userService.getUser());
    let userId = new FormData();
    userId.append("user_id", user.id);
    this.loading = true;
    this.userService.getFollowers(userId).subscribe(res => {
      this.loading = false;
      this.path = res.data.urlkey;
      this.followers = res.data.follower;
      console.log(res.data.follower);
    })
  }

}
