import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';
import { Meta } from '@angular/platform-browser';

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

  constructor(private userService: UserService, private route: ActivatedRoute, private metaService: Meta) { }

  ngOnInit(): void {
    let id = this.route.snapshot.params.id;
    this.loading = true;
    this.userService.getPostById(id).subscribe((res: any) => {
      this.loading = false;
      this.post = res.data.user_post;
    })

    this.metaService.addTags([
      { property: 'og:title', content: 'Tanito - Social Learning Platform' },
      { property: 'og:url', content: 'https://www.imdb.com/title/tt0117500/' },
      { property: 'og:image', content: 'https://scx2.b-cdn.net/gfx/news/2019/2-nature.jpg' },
      { property: 'og:description', content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." }
    ]);
  }

}
