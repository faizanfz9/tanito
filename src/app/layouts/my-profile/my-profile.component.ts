import { ViewEncapsulation } from '@angular/core';
import { Component, ContentChild, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ChatService } from 'src/app/shared/chat.service';
import { UserService } from 'src/app/shared/user.service';
import { VideoProcessingService } from 'src/app/shared/video-processing.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyProfileComponent implements OnInit {
  user: any;
  selectedImg: any;
  selectedVideo: any;
  imgThumb: any = "";
  videoThumb: any = "";
  modalRef: any;
  loggedUserId: any;
  defaultChatroom: any;
  @ViewChild('timeline', {static: true}) timelineBlock: any;
  @ViewChild('createPost', {static: true}) createPost: any;
  loading = false;
  userAvatar = "assets/images/icons/user_avatar.svg";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";
  
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
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private videoService: VideoProcessingService,
    private chatService: ChatService ) 
  { 
    this.userService.storeUpdatedUser().subscribe(res => {
      this.user.user_post_data = res.user_post_data;
      localStorage.setItem("user", JSON.stringify(this.user));
    })
  }

  ngOnInit(): void {
    this.user = JSON.parse(this.userService.getUser());
    if(this.route.snapshot.queryParams.post) {
      this.openModal(this.createPost); 
    }

    this.defaultChatroom = localStorage.getItem("defaultChatroom");
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

  removeImg() {
    this.selectedImg = null;
    this.imgThumb = "";
  }

  removeVideo() {
    this.selectedImg = null;
    this.videoThumb = "";
  }

  onSelectVideo(event: any) {
    this.selectedVideo = event.target.files[0];
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
    this.loading = true;
    this.userService.createPost(post).subscribe(res => {
      if(res.status == "false") {
        this.loading = false;
        alert(res.msg);
      }else {
        this.loading = false;
        form.reset();
        this.imgThumb = "";
        this.videoThumb = "";
        this.userService.updateUser();
        this.modalRef.hide();
        this.timelineBlock.nativeElement.scrollIntoView({behavior:'smooth'});
      }
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'tanito' }));
  }
  
}
