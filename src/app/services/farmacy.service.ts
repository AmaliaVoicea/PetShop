import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FarmacyProduct } from '../models/farmacyProduct';
import { UserLoginResponse } from '../models/userLoginResponse';

@Injectable({
  providedIn: 'root'
})
export class FarmacyService {

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

  public getAllFarmacyProducts(): Observable<FarmacyProduct[]> {
    return this.http.get<FarmacyProduct[]>(environment.apiEndpoint + "farmacy");
  }

  public getFarmacyProductById(farmacyProductId: string): Observable<FarmacyProduct> {
    return this.http.get<FarmacyProduct>(environment.apiEndpoint + "farmacy/" + farmacyProductId);
  }

}
