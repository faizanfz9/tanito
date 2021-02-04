import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  loggedUser: any;

  constructor(private userService: UserService, 
    private afAuth: AngularFireAuth, 
    private db: AngularFireDatabase) {
    this.loggedUser = JSON.parse(this.userService.getUser()) 
    // this.afAuth.authState.subscribe(auth => {
    //   if (auth !== undefined && auth !== null) {
    //     this.loggedUser = auth;
    //     console.log(this.loggedUser);
    //   }
    // });
  }

  sendMessage(msg: string, chatroom: any) {
    const timestamp = this.getTimeStamp();
    let chatMessage: any = [];
    chatMessage = this.getMessages(chatroom);
    chatMessage.push({
      message: msg,
      timeSent: timestamp,
      senderName: "faizan",
      senderId: this.loggedUser.id
    })
  }

  getMessages(receiver: any) {
    let user_1 = receiver;
    let user_2 = this.loggedUser.id;
    return this.db.list("/chats/" + user_1 + "&" + user_2);
  }

  getTimeStamp() {
    const now = new Date();
    const date = now.getUTCFullYear() + '/' +
                 (now.getUTCMonth() + 1) + '/' +
                 now.getUTCDate();
    const time = now.getUTCHours() + ':' +
                 now.getUTCMinutes() + ':' +
                 now.getUTCSeconds();
    return (date + ' ' + time);
  }

  getRooms() {
    return this.db.list("/members/");
  }

  createRoom(member: any) {
    this.db.list("/members/").push({
      memberId: member.user_id,
      memberName: member.username,
      memberType: member.usertype,
      profileImg: member.profile_img,
    })
  }
}
