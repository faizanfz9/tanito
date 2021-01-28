import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { forkJoin } from "rxjs"
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  feeds: any = [];
  loading = false;
  imageDirPath = "http://demo.mbrcables.com/tanito/assets/user-post-media/image/";
  videoDirPath = "http://demo.mbrcables.com/tanito/assets/user-post-media/video/";
  userAvatar = "assets/images/icons/user_avatar.svg";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loading = true;
    forkJoin(this.userService.fetchUserFollowing()).pipe(map(res => {
      let feeds: any = [];
         res.forEach((item: any, index: number) => {
        item.data.user_post_data.forEach((post: any) => {
          feeds.push(
            {
              username: item.data.results.username,
              usertype: item.data.results.usertype,
              university: item.data.results.university,
              profile: item.data.urlkey + item.data.results.profile_img,
              post: post
            }
          )
        })
      })
      return feeds;
    })).subscribe(res => {
        this.loading = false;
        this.feeds = res;
    })
  }

}
