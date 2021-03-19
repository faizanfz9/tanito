import { TemplateRef } from '@angular/core';
import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  reactionModalTitle: any;
  modalRef: any;
  reactionFetched = false;
  baseurl: any;
  activePlan: any;
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
    this.userService.updateUser();
    this.userService.storeUpdatedUser().subscribe(res => {
      this.myData.user_post_data = res.user_post_data;
      localStorage.setItem("user", JSON.stringify(this.myData));
    })
    this.baseurl = window.location.origin;
    this.activePlan = this.loggedUser.plan_subcription[this.loggedUser.plan_subcription.length - 1];
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
      this.reactionModalTitle = "Reactions";
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

  isPostLiked(likes: any) {
    return likes.some((item: any) => item.user_id == this.loggedUser.id)
  }

  checkLikeType(likes: any): any {
    let myLike = likes.find((item: any) => item.user_id == this.loggedUser.id);
    if(myLike) {
      if(myLike.like_type == 1) {
        return "assets/images/icons/lightbulb.png"
      }else if(myLike.like_type == 2) {
        return "assets/images/icons/clap.png"
      }else if(myLike.like_type == 3) {
        return "assets/images/icons/like.png"
      }else {
        return "assets/images/icons/like_icon.png"
      }
    }else {
      return "assets/images/icons/like_icon.png"
    }
  }

  getLikeType(likes: any): any {
    let myLike = likes.find((item: any) => item.user_id == this.loggedUser.id);
    if(myLike) {
      return myLike.like_type;
    }else {
      return 0
    }
  }

  changeTabs(el: HTMLElement) {
    let reactionBlock: any = document.getElementsByClassName("reactions");
    reactionBlock.classList.remove("active");
    el.classList.add("active");
  }

  onCommentOnPost(postId: any, form: NgForm) {
    let commentData = new FormData();
    commentData.append('from_id', this.loggedUser.id);
    commentData.append('post_id', postId);
    commentData.append('comment', form.value.comment);
    this.loading = true;
    let post = this.myData.user_post_data.find((item: any) => item.id == postId);
    let myComments = post.comment.filter((item: any) => item.user_id == this.loggedUser.id);
    if(!this.activePlan) {
      if(myComments.length < 5) {
        this.loading = true;
        this.userService.commentOnPost(commentData).subscribe((res: any) => {
          this.loading = false;
          post.comment.push(res.data);
          form.reset();
        })
      }else {
        alert('Comment limit on one post has reached, Subscribe to our plans to comment further!');
      }
    }else {
      this.loading = true;
      this.userService.commentOnPost(commentData).subscribe((res: any) => {
        this.loading = false;
        post.comment.push(res.data);
        form.reset();
      })
    }
  }

  onDeleteComment(comment: any) {
    let comment_Id = new FormData();
    comment_Id.append('comment_id', comment.commentID);
    let post = this.myData.user_post_data.find((item: any) => item.id == comment.post_id);
    let r = confirm("Do you want to delete this comment?");
    if (r == true) {
      this.loading = true;
      this.userService.deleteComment(comment_Id).subscribe(res => {
        this.loading = false;
        post.comment.splice(post.comment.findIndex((item: any) => item.commentID == comment.commentID), 1)
      })
    }
  }

  isCommentLiked(likes: any) {
    return likes.some((item: any) => item.from_id == this.loggedUser.id);
  }

  checkCommentLikeType(likes: any): any {
    let myLike = likes.find((item: any) => item.from_id == this.loggedUser.id);
    if(myLike) {
      if(myLike.reactionType == 1) {
        return "assets/images/icons/lightbulb.png"
      }else if(myLike.reactionType == 2) {
        return "assets/images/icons/clap.png"
      }else if(myLike.reactionType == 3) {
        return "assets/images/icons/like.png"
      }else {
        return "assets/images/icons/like_icon.png"
      }
    }else {
      return "assets/images/icons/like_icon.png"
    }
  }

  getCommentLikeType(likes: any): any {
    let myLike = likes.find((item: any) => item.from_id == this.loggedUser.id);
    if(myLike) {
      return +myLike.reactionType;
    }else {
      return 0;
    }
  }

  onLikeComment(postId: any, commentId: any, commentLikeType: any, el: HTMLElement) {
    let postInfo = new FormData();
    postInfo.append("from_id", this.loggedUser.id);
    postInfo.append("post_id", postId);
    postInfo.append("comment_id", commentId);
    postInfo.append("reactionType", commentLikeType);

    this.userService.likeComment(postInfo).subscribe((res: any) => {
      let parentEl = el.parentElement;
      let likesEl = parentEl?.nextSibling as HTMLElement;
      let totalLikes = +likesEl.innerHTML as any;
      let likeTypeEl = el.firstChild as HTMLElement;
      switch(commentLikeType) {
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
  
  onViewCommentReaction(comment_id: any) {
    let commentId = new FormData();
    commentId.append("comment_id", comment_id);
    this.openModal(this.viewReactions);
    this.userService.viewCommentReaction(commentId).subscribe((res: any) => {
      this.reactionFetched = true;
      this.reactionModalTitle = "Comment Reactions";
      let reactions = res.data.my_post;
      this.totalUserReaction = reactions;
      this.okUserReaction = reactions.filter((item: any) => {
        return item.reactionType == 0
      });
      this.innUserReaction = reactions.filter((item: any) => {
        return item.reactionType == 1
      });
      this.clapUserReaction = reactions.filter((item: any) => {
        return item.reactionType == 2
      });
      this.goodUserReaction = reactions.filter((item: any) => {
        return item.reactionType == 3
      });
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'reaction_modal' }));
  }

  toggleShareGroup(el: any) {
    let shareBtnGroup = el.previousSibling;
    if(shareBtnGroup.classList.contains("show")) {
      shareBtnGroup.classList.remove("show");
    }else {
      shareBtnGroup.classList.add("show");
    }
  }

}
