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
    private db: AngularFireDatabase,
    private afs: AngularFirestore) {
    this.loggedUser = JSON.parse(this.userService.getUser()) 
    // this.afAuth.authState.subscribe(auth => {
    //   if (auth !== undefined && auth !== null) {
    //     this.loggedUser = auth;
    //     console.log(this.loggedUser);
    //   }
    // });
  }

  sendMessage(msg: string) {
    const timestamp = this.getTimeStamp();
    const email = "faizan@abc.com";
    let chatMessage: any = [];
    chatMessage = this.getMessages();
    chatMessage.push({
      message: msg,
      timeSent: timestamp,
      senderName: "faizan",
      senderId: this.loggedUser.id
    })
  }

  getMessages() {
    return this.db.list("/messages");
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
}
