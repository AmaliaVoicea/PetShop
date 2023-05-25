import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserLoginResponse } from '../models/userLoginResponse';
import { User } from '../models/user';
import { Roles } from '../models/roles';
import { PasswordRequest } from '../models/passwordRequest';
import { DatePipe } from '@angular/common';

@Injectable()
export class UserService {
    // public contractLinkCode:string | null; 
    // public contractLinkEmail: string | null;
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
    // public checkLinkEmail(): any{
    //     if(this.contractLinkEmail == null || this.contractLinkEmail == '') return null;
    //     return this.contractLinkEmail;
    // }

    get currentUserValue(): UserLoginResponse {
      return this.currentUserSubject.value;
    }

    constructor(private http: HttpClient, private jwtHelper: JwtHelperService,public datepipe: DatePipe){
        console.log(localStorage.getItem('token'));

        const uData = this.GetUserData();
        if(uData && uData.token && jwtHelper.isTokenExpired(uData.token) == false){
            this.currentUserSubject = new BehaviorSubject<UserLoginResponse>(uData);
        }
        else{
            this.currentUserSubject = new BehaviorSubject<UserLoginResponse>(null);
        }
        this.currentUser = this.currentUserSubject.asObservable();
    }

    confirm(email: string, code: string): Observable<void> {
      return this.http.post<any>(environment.endpoint + "/confirm?", {email, code});
    }

    public updateProfile(userData: User): Observable<UserLoginResponse>{
        return this.http.put<UserLoginResponse>(environment.apiEndpoint + "user/me/" + userData.id, userData, {
             headers: this.privateHeader.headers }).pipe(map(user => {
            this.currentUserSubject.next(user);
            this.SaveUserData(user);
            return user;
        }));
    }

    public updateRole(userData: User): Observable<UserLoginResponse>{
        return this.http.put<UserLoginResponse>(environment.apiEndpoint + "user/me/" + userData.id, userData, {
             headers: this.privateHeader.headers }).pipe(map(user => {
            return user;
        }));
    }

    public updateUserPassword(currentPassword: string, passwordRequest: any): Observable<UserLoginResponse>{
        return this.http.put<UserLoginResponse>(environment.apiEndpoint + "user/me/password", new PasswordRequest(currentPassword, passwordRequest)).pipe(map(user => {
            this.currentUserSubject.next(user);
            this.SaveUserData(user);
            return user;
        }));
    }

    public getUserProfile(): Observable<User>{
        const uData = this.GetUserData();
        return this.http.get<User>(environment.apiEndpoint + "user/me");
    }

    public IsUserAdmin(): boolean{
        if(this.currentUserValue != null){
            const decoded = this.jwtHelper.decodeToken(this.currentUserValue.token);
            console.log(decoded.ROLE)
            return decoded.ROLE == Roles.Admin;
        }
        return false;
    }

    public GetUserRole(): string | null {
        if(this.currentUserValue != null){
            const decoded = this.jwtHelper.decodeToken(this.currentUserValue.token);
            return decoded.ROLE;
        }
        return null;
    }

    public LoginUser(user: User): Observable<UserLoginResponse>{

        return this.http.post<UserLoginResponse>(environment.apiEndpoint + "user/authenticate", user, { headers: this.header }).pipe(map(user => {
            this.currentUserSubject.next(user);
            this.SaveUserData(user);
            return user;
        }));
    }

    public CreateUser(user: User): Observable<UserLoginResponse>{
        return this.http.post<UserLoginResponse>(environment.apiEndpoint + "user/createPortalUser", user).pipe(map(user => {
            this.currentUserSubject.next(user);
            this.SaveUserData(user);
            return user;
        }));
    }

    public SaveUserData(userData: UserLoginResponse){
        localStorage.setItem(environment.isUserDataKey, JSON.stringify(userData));
    }

    public GetUserData(): UserLoginResponse{
        try{
            return JSON.parse(localStorage.getItem(environment.isUserDataKey)!);
        }
        catch{
            return null;
        }
    }

    public DeleteUserData(){
        try{
            localStorage.removeItem(environment.isUserDataKey);
        }
        catch{
            return null;
        }
    }

    public Delete(userId: String) : Observable<boolean>
    {
        return this.http.delete<boolean>(environment.apiEndpoint + "user/" + userId).pipe(map(res => {
            return res;
        }));
    }

    public LogoutUser(): Observable<UserLoginResponse>{
        const uData = this.GetUserData();
        this.DeleteUserData();
        this.currentUserSubject.next(null);
        return this.http.post<UserLoginResponse>(environment.apiEndpoint + "user/logout", {}).pipe(map(user => {
            return user;
        }));
    }

    public userList: User[] = []; 
    public getAllUsers(): Observable<User[]>{
        return this.http.get<User[]>(environment.apiEndpoint + "user/all").pipe(map(list => {
            this.userList = list;
            return list;
        }));
    }
}