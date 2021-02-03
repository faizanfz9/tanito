import { TemplateRef } from '@angular/core';
import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  @Input() myData: any;
  loading = false;
  loggedUser: any;
  totalUserReaction: any;
  okUserReaction: any;
  innUserReaction: any;
  clapUserReaction: any;
  goodUserReaction: any;
  modalRef: any;
  likeType = 0;
  reactionFetched = false;
  @ViewChild("viewReactions") viewReactions: any;
  @ViewChild('postBlock', {static: true}) postBlock: any;
  profilePath = "http://demo.mbrcables.com/tanito/assets/user-profile/";
  imageDirPath = "http://demo.mbrcables.com/tanito/assets/user-post-media/image/";
  videoDirPath = "http://demo.mbrcables.com/tanito/assets/user-post-media/video/";
  userAvatar = "assets/images/icons/user_avatar.svg";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";

  constructor(private userService: UserService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(this.userService.getUser());
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
      this.userService.updateUser();
    })
  }

  onViewReaction(post_id: any) {
    let postId = new FormData();
    postId.append("post_id", post_id);
    this.openModal(this.viewReactions);
    this.userService.viewReaction(postId).subscribe((res: any) => {
      this.reactionFetched = true;
      let reactions = res.data.my_post;
      this.totalUserReaction = reactions;
      this.okUserReaction = reactions.filter((item: any) => {
        return item.like_type == 0
      });
      this.innUserReaction = reactions.filter((item: any) => {
        return item.like_type == 1
      });
      this.clapUserReaction = reactions.filter((item: any) => {
        return item.like_type == 2
      });
      this.goodUserReaction = reactions.filter((item: any) => {
        return item.like_type == 3
      });
    })
  }

  changeTabs(el: HTMLElement) {
    let reactionBlock: any = document.getElementsByClassName("reactions");
    reactionBlock.classList.remove("active");
    el.classList.add("active");
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'reaction_modal' }));
  }

}
