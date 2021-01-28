import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = "https://demo.mbrcables.com/tanito/Api";
  // private follower = new Subject<string>();
  private user = new Subject<any>();
  constructor(private http: HttpClient) { }

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
          followed: loggedUser.following_id.some((item: any) => item.follower == user.id),
          data: user
        })
      })
      return { urlkey: urlkey, users: usersArr };
    }));
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


}
