import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  // Get User
  getUser(): any {
    return localStorage.getItem("user");
  }
}
