import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.baseUrl;
  private user = new Subject<any>();
  constructor(private http: HttpClient) {
  }

  // Get Authenticated User
  getUser(): any {
    return localStorage.getItem("user");
  }

  // Logged in user Id
  loggedUserId() {
    return JSON.parse(this.getUser()).id;
  }

  // Get User by id
  getUserById(id: any) {
    return this.http.post<{status: string, msg: string, data: any}>(this.url + "/get_user_profile", id);
  }

  // Fetch all users
  fetchAllUser() {
    let loggedUserId = this.loggedUserId();
    let loggedUser = JSON.parse(this.getUser());
    return this.http.get<{status: string, msg: string, data: any}>(this.url + "/all_users").pipe(map(function(res){
      let users = res.data.results;
      let urlkey = res.data.urlkey;
      let usersArr: any = [];
      users = users.filter((user: any) => {
        return user.id !== loggedUserId
      })
      users.forEach(function(user: any){
        usersArr.push({
          followed: loggedUser.following_id ? loggedUser.following_id.some((item: any) => item.follower == user.id) : false,
          data: user
        })
      })
      return { urlkey: urlkey, users: usersArr };
    }));
  }

  // Search users
  searchUser(query: any) {
    let loggedUserId = this.loggedUserId();
    let loggedUser = JSON.parse(this.getUser());
    return this.http.post(this.url + "/search_people", query).pipe(map(function(res: any){
      let users = res.data.results;
      let urlkey = res.data.urlkey;
      let usersArr: any = [];
      users = users.filter((user: any) => {
        return user.id !== loggedUserId && (+user.usertype == 2 || +user.usertype == 3);
      })
      users.forEach(function(user: any){
        usersArr.push({
          followed: loggedUser.following_id ? loggedUser.following_id.some((item: any) => item.follower == user.id) : false,
          data: user
        })
      })
      return { urlkey: urlkey, users: usersArr };
    }));;
  }

  // Get subjects
  getSubjects() {
    return this.http.get(this.url + "/select_subject");
  }

  // Get tags
  getTags() {
    return this.http.get(this.url + "/get_tags");
  }

  // Get user followers
  getFollowers(id: any) {
    return this.http.post<{status: string, msg: string, data: any}>(this.url + "/get_follower", id);
  }

  // Get user following
  getFollowing(id: any) {
    return this.http.post<{status: string, msg: string, data: any}>(this.url + "/get_following", id);
  }

  // Follow user
  followUser(followId: any) {
    return this.http.post<{status: string, msg: string}>(this.url + "/followto", followId);
  }

  // Update logged user data
  updateUser() {
    let id = new FormData();
    id.append("id", this.loggedUserId());
    this.getUserById(id).subscribe(res => {
      this.user.next(res.data);
    })
  }

  // Store logged user data
  storeUpdatedUser() {
    return this.user.asObservable();
  }

  // Create post
  createPost(id: any) {
    return this.http.post<{status: string, msg: string}>(this.url + "/create_post", id);
  }

  // Delete post
  deletePost(postInfo: any) {
    return this.http.post<{status: string, msg: string}>(this.url + "/delete_post", postInfo);
  }

  // Get all post
  getAllPost(pageNo: any = 1, category: any = '') {
    return this.http.get(this.url + "/get_all_post?per_page=" + pageNo + "&subject=" + category);
  }

  // Get all post
  getPostById(id: any) {
    return this.http.get(this.url + "/get_post_by_id/" + id);
  }

  // Fetch user following
  fetchUserFollowing() {
    let urls: any = [];
    JSON.parse(this.getUser()).following_id.forEach((item: any) => {
      let userId = new FormData();
      userId.append("id", item.follower);
      urls.push(this.http.post<{status: string, msg: string, data: any}>(this.url + "/get_user_profile", userId))
    })
    return urls;
  }

  // Like Unlike Post
  likePost(postInfo: any) {
    return this.http.post(this.url + "/post_like", postInfo);
  }

  // View Post Reactions
  viewReaction(postId: any) {
    return this.http.post(this.url + "/post_like_by_user", postId);
  }

  // to check if chat is created
  createChat(postId: any) {
    return this.http.post(this.url + "/create_chat", postId);
  }

  // Report user 
  reportUser(reportCriteria: any) {
    return this.http.post(this.url + "/user_report", reportCriteria);
  }

  // Report post 
  reportPost(reportCriteria: any) {
    return this.http.post(this.url + "/post_report", reportCriteria);
  }

  // Rate teacher 
  rateTeacher(rateCriteria: any) {
    return this.http.post(this.url + "/user_rating", rateCriteria);
  }

  // Get rating
  getRating(id: any) {
    return this.http.post(this.url + "/ratingByID", id);
  }

  // Commnet on post
  commentOnPost(comment: any) {
    return this.http.post(this.url + "/users_comment", comment);
  }

  // Delete post
  deleteComment(commentId: any) {
    return this.http.post(this.url + "/comment_delete", commentId);
  }

  // Like post comment
  likeComment(commentInfo: any) {
    return this.http.post(this.url + "/comment_reaction", commentInfo);
  }

  // Like post comment
  viewCommentReaction(commentId: any) {
    return this.http.post(this.url + "/comment_like_by_user", commentId);
  }

  // Get user comments
  userComments(userId: any) {
    return this.http.post(this.url + "/count_comment_by_id", userId);
  }

  // Contact us query
  sendQuery(userQuery: any) {
    return this.http.post(this.url + "/contact_us", userQuery)
  }

  // Get total number of teacher, students and posts
  getTotalData() {
    return this.http.get(this.url + "/count_all_data");
  }

  // Get Resources
  getResources() {
    return this.http.get(this.url + "/resource");
  }

  // Create Session
  createSession(session: any) {
    return this.http.post(this.url + "/create_session", session)
  }

  // Get Session
  getSessions(userId: any) {
      return this.http.post(this.url + "/get_session", userId)
  }
}
