import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from 'src/app/shared/user.service';
import { VideoProcessingService } from 'src/app/shared/video-processing.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  user: any;
  userAvatar = "assets/images/icons/user_avatar.svg";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";
  selectedImg: any;
  selectedVideo: any;
  imgThumb: any = "";
  videoThumb: any = "";

  allsubjects = [
    'Mathematics',
    'Polynomials',
    'Statistics',
    'Science',
    'Social Science',
    'English',
  ];

  constructor(
    private userService: UserService, 
    private modalService: BsModalService,
    private videoService: VideoProcessingService
  ) 
  { }

  ngOnInit(): void {
    this.user = JSON.parse(this.userService.getUser());
  }

  onSelectImage(event: any) {
    this.selectedImg = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.imgThumb = event.target.result;
      }
    }
  }

  onSelectVideo() {
    this.videoService.promptForVideo().then(videoFile => {
      return this.videoService.generateThumbnail(videoFile);
    }).then(thumbnailData => {
      this.videoThumb = thumbnailData;
    })
  }

  onCreatePost(form: NgForm) {
    let post = new FormData();
    post.append("user_id", this.user.id);
    post.append("body", form.value.body);
    post.append("image", this.selectedImg);
    post.append("video", this.selectedVideo);
    post.append("subject", form.value.subject);
    this.userService.createPost(post).subscribe(res => {
      console.log(res);
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalService.show(template, Object.assign({}, { class: 'tanito' }));
  }
}
