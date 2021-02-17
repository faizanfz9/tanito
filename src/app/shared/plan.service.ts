import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  url = environment.baseUrl;
  
  constructor(private http: HttpClient) { }

  getPlans() {
    return this.http.get(this.url + "/get_plan_list");
  }

}
