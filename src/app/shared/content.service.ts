import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  url = environment.baseUrl;

  constructor(private http: HttpClient) { }

  aboutUsContent() {
    return this.http.get(this.url + "/aboutus");
  }

  privacyPolicyContent() {
    return this.http.get(this.url + "/privacypolicy");
  }

  termsAndConditionContent() {
    return this.http.get(this.url + "/termcondition");
  }
}
