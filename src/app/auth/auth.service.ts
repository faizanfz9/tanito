import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }  

  register(user: any) {
    return this.http.post<{status: string, msg: string}>("http://demo.mbrcables.com/tanito/Api/register", user)
  }

}
