import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  loggedUser: any;
  likeType = 0;
  currPostId: any;
  loading = false;
  imageDirPath = "http://demo.mbrcables.com/tanito/assets/user-post-media/image/";
  videoDirPath = "http://demo.mbrcables.com/tanito/assets/user-post-media/video/";
  userAvatar = "assets/images/icons/user_avatar.svg";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(this.userService.getUser());
    if(this.loggedUser.following_id) {
      if(this.loggedUser.following_id.length > 0) {
        this.loading = true;
        forkJoin(this.userService.fetchUserFollowing()).pipe(map(res => {
          let feeds: any = [];
            res.forEach((item: any, index: number) => {
            item.data.user_post_data.forEach((post: any) => {
              feeds.push(
                {
                  userId: item.data.results.user_id,
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
  }
  
  onLikePost(postId: any, likeType: any, el: HTMLElement) {
    let postInfo = new FormData();
    postInfo.append("user_id", this.loggedUser.id);
    postInfo.append("post_id", postId);
    postInfo.append("like_type", likeType);

    this.userService.likePost(postInfo).subscribe((res: any) => {
      let parentEl = el.parentElement;
      let likesEl = parentEl?.nextSibling as HTMLElement;
      let totalLikes = +likesEl.innerHTML as any;
      let likeTypeEl = el.firstChild as HTMLElement;
      switch(likeType) {
        case 1:
          likeTypeEl.setAttribute("src", "assets/images/icons/lightbulb.png");
          break;
        case 2:
          likeTypeEl.setAttribute("src", "assets/images/icons/clap.png");
          break; 
        case 3:
        likeTypeEl.setAttribute("src", "assets/images/icons/like.png");
        break;  
        default:
          likeTypeEl.setAttribute("src", "assets/images/icons/like_icon.png");
      }
      if(res.likeStatus == 1) {
        el.classList.add("liked");
        totalLikes += 1
        likesEl.innerHTML = totalLikes;
      }else if(res.likeStatus == 0) {
        el.classList.remove("liked");
        totalLikes -= 1
        likesEl.innerHTML = totalLikes;
        likeTypeEl.setAttribute("src", "assets/images/icons/like_icon.png");
      }
    })
  }

}
