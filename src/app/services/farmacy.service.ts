import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FarmacyProduct } from '../models/farmacyProduct';
import { Org } from '../models/org';
import { OrgLoginResponse } from '../models/orgLoginResponse';
import { PasswordRequest } from '../models/passwordRequest';
import { Roles } from '../models/roles';

@Injectable({
  providedIn: 'root'
})
export class FarmacyService {
  public currentOrgSubject: BehaviorSubject<OrgLoginResponse>;
  public currentOrg: Observable<OrgLoginResponse>;
  public isAdmin: boolean = false;
  header = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  public pvHeader
generateHeader(token: string){
 var privateHeader ={
    headers : new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    }),
  };
  return privateHeader;
}
  get currentOrgValue(): OrgLoginResponse {
    return this.currentOrgSubject.value;
  }

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    const oData = this.GetOrgData();
    if (oData && oData.token && jwtHelper.isTokenExpired(oData.token) == false) {
      this.currentOrgSubject = new BehaviorSubject<OrgLoginResponse>(oData);
      this.pvHeader = this.generateHeader(oData.token);
    } else {
      this.currentOrgSubject = new BehaviorSubject<OrgLoginResponse>(null);
    }
    this.currentOrg = this.currentOrgSubject.asObservable();
   }

   confirm(email: string, code: string): Observable<void> {
    return this.http.post<any>(environment.endpoint + "/confirm?", {email, code});
  }

  public updateProfile(orgData: Org): Observable<OrgLoginResponse> {
    return this.http.put<OrgLoginResponse>(environment.apiEndpoint + "ong/me/" + orgData.id, orgData, {headers: this.pvHeader.headers}).pipe(map(org => {
      this.currentOrgSubject.next(org);
      this.SaveOrgData(org);
      return org;
    }));
  }

  public updateOrgPassword(currentPassword: string, passwordRequest: any): Observable<OrgLoginResponse> {
    return this.http.put<OrgLoginResponse>(environment.apiEndpoint + "ong/me/password", new PasswordRequest(currentPassword, passwordRequest),{headers: this.pvHeader.headers}).pipe(map(org => {
      this.currentOrgSubject.next(org);
      this.SaveOrgData(org);
      return org;
    }));
  }

  public getOrgProfile(): Observable<Org> {
    const oData = this.GetOrgData();
    return this.http.get<Org>(environment.apiEndpoint + "ong/me");
  }

  // public isOrgAdmin(): boolean {
  //   if(this.currentOrgValue != null) {
  //     const decoded = this.jwtHelper.decodeToken(this.currentOrgValue.jwt);
  //     return decoded.ROLE == Roles.AdminONG;
  //   }
  //   return false;
  // }

  public GetUserOrgRole(): string | null {
    if(this.currentOrgValue != null) {
      const decoded = this.jwtHelper.decodeToken(this.currentOrgValue.token);
      return decoded.ROLE;
    }
    return null;
  }

  public LoginOrgUser(org: Org): Observable<OrgLoginResponse> {
    return this.http.post<OrgLoginResponse>(environment.apiEndpoint + "ong/authenticate", org, { headers: this.header }).pipe(map(org => {
      this.currentOrgSubject.next(org);
      localStorage.setItem('token',org.token);
      this.SaveOrgData(org);
      return org;
    }));
  }

  public CreateOrg(org: Org): Observable<OrgLoginResponse> {
    return this.http.post<OrgLoginResponse>(environment.apiEndpoint + "ong/createPortalUserOng", org).pipe(map(org => {
      this.currentOrgSubject.next(org);
      this.SaveOrgData(org);
      return org;
    }));
  }

  public SaveOrgData(orgData: OrgLoginResponse) {
    localStorage.setItem(environment.isOrgDataKey, JSON.stringify(orgData));
  }

  public GetOrgData(): OrgLoginResponse {
    try {
      console.log(localStorage.getItem(environment.isOrgDataKey))
      return JSON.parse(localStorage.getItem(environment.isOrgDataKey)!);
    } catch {
      return null;
    }
  }

  public DeleteOrgData() {
    try {
      localStorage.removeItem(environment.isOrgDataKey);
    } catch {
      return null;
    }
  }

  public Delete(orgId: string) : Observable<boolean>
    {
        return this.http.delete<boolean>(environment.apiEndpoint + "ong/" + orgId).pipe(map(res => {
            return res;
        }));
    }

  public LogoutOrgUser(): Observable<OrgLoginResponse> {
    const oData = this.GetOrgData();
    this.DeleteOrgData();
    this.currentOrgSubject.next(null);
    return this.http.post<OrgLoginResponse>(environment.apiEndpoint + "ong/logout", {}).pipe(map(org =>{
      return org;
    }));
  }

  public getAllFarmacyProducts(): Observable<FarmacyProduct[]> {
    return this.http.get<FarmacyProduct[]>(environment.apiEndpoint + "farmacy");
  }

  public getOrgByName(orgName: string): Observable<Org> {
    return this.http.get<Org>(environment.apiEndpoint + "ong/name/" + orgName);
  }

  public getOrgById(orgId: string): Observable<Org> {
    return this.http.get<Org>(environment.apiEndpoint + "ong/" + orgId);
  }
}
