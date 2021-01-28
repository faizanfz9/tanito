import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  @Input() myData: any;
  loading = false;
  @ViewChild('postBlock', {static: true}) postBlock: any;
  imageDirPath = "http://demo.mbrcables.com/tanito/assets/user-post-media/image/";
  videoDirPath = "http://demo.mbrcables.com/tanito/assets/user-post-media/video/";
  userAvatar = "assets/images/icons/user_avatar.svg";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.storeUpdatedUser().subscribe(res => {
      this.myData.user_post_data = res.user_post_data;
      localStorage.setItem("user", JSON.stringify(this.myData));
    })
  }

  onDeletePost(postId: any) {
    let postInfo = new FormData();
    postInfo.append("user_id", this.myData.id);
    postInfo.append("post_id", postId);
    let r = confirm("Do you want to delete this post?");
      if (r == true) {
        this.loading = true;
        this.userService.deletePost(postInfo).subscribe(res => {
          this.loading = false;
          this.userService.updateUser();
          this.postBlock.nativeElement.scrollIntoView({behavior:'smooth'});
        })
      }
  }

}
