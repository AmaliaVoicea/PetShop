import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLoginResponse } from '../models/userLoginResponse';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { AccessoryProduct } from '../models/accessoryProduct';

@Injectable({
  providedIn: 'root'
})
export class AccessoryService {

  public currentUserSubject: BehaviorSubject<UserLoginResponse>;
  public currentUser: Observable<UserLoginResponse>;
  public isAdmin: boolean = false;
  
  header = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  privateHeader ={
      headers : new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
  };

  constructor(private http: HttpClient) {
  }

  public getAllAccessoryProducts(): Observable<AccessoryProduct[]> {
    return this.http.get<AccessoryProduct[]>(environment.apiEndpoint + "accessories");
  }

  public getAccessoryById(accessoryId: string): Observable<AccessoryProduct> {
    return this.http.get<AccessoryProduct>(environment.apiEndpoint + "accessories/" + accessoryId);
  }

}
