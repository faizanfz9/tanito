import { query } from '@angular/animations';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  sender: any;
  senderId: any;
  receiverId: any;
  chatId: any;

  constructor(private userService: UserService, 
    private afAuth: AngularFireAuth, 
    private db: AngularFireDatabase) {
    this.sender = JSON.parse(this.userService.getUser());
    this.senderId = this.sender.id
    // this.afAuth.authState.subscribe(auth => {
    //   if (auth !== undefined && auth !== null) {
    //     this.loggedUser = auth;
    //     console.log(this.loggedUser);
    //   }
    // });
  }

  sendMessage(msg: string, chatId: any) {
    const timestamp = this.getTimeStamp();
    let chatMessage: any = [];
    chatMessage = this.getMessages(chatId);
    chatMessage.push({
      message: msg,
      timeSent: timestamp,
      senderName: "faizan",
      senderId: this.senderId
    })
  }

  getMessages(chatId: any) {
    console.log(chatId)
    return this.db.list("/chats/" + chatId);
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

  getRooms(senderId: any) {
    return this.db.list("/members/" + senderId);
  }

  createRoom(receiver: any) {
    let sender = this.sender;
    let receiverId = this.receiverId;
    let chatId = this.chatId;
    let db = this.db;
    this.db.database.ref("/members/").once("value").then(function(snapshot){
      if(!snapshot.child(receiverId).exists()) {
        db.list("/members/" + sender.id).push({
          chatId: chatId,
          memberId: receiver.user_id,
          memberName: receiver.username,
          profileImg: receiver.profile_img,
        })
        db.list("/members/" + receiverId).push({
          chatId: chatId,
          memberId: sender.id,
          memberName: sender.username,
          profileImg: sender.profile_img,
        })
      }
    })
  }
}
