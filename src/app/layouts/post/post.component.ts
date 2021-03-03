import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  post: any;
  loading = false;
  profilePath = "https://demo.mbrcables.com/tanito/assets/user-profile/";
  imageDirPath = "https://demo.mbrcables.com/tanito/assets/user-post-media/image/";
  videoDirPath = "https://demo.mbrcables.com/tanito/assets/user-post-media/video/";
  userAvatar = "assets/images/icons/user_avatar.svg";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    let id = this.route.snapshot.params.id;
    this.loading = true;
    this.userService.getPostById(id).subscribe((res: any) => {
      this.loading = false;
      this.post = res.data.user_post;
    })
  }

}
