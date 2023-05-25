import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Adoption } from '../models/adoption';

@Injectable({
  providedIn: 'root'
})
export class AdoptionsService {

  privateHeader ={
    headers : new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    }),
  };
  adoptionState: any;

  constructor(private http: HttpClient) { }

  public updateAdoptionRequest(adoptionData: Adoption): Observable<Adoption> {
    return this.http.put<Adoption>(environment.apiEndpoint + "adoptions/change/" + adoptionData.id, adoptionData, {
      headers: this.privateHeader.headers }).pipe(map(adoption => {
        return adoption;
      }));
  }

  public createAdoptionRequest(adoption: Adoption): Observable<Adoption> {
    return this.http.post<Adoption>(environment.apiEndpoint + "adoptions/create/adoption", adoption, {headers: this.privateHeader.headers}).pipe(map( adoption => {
      return adoption;
  }));
  }

  public getAllAdoptions(): Observable<Adoption[]> {
    return this.http.get<Adoption[]>(environment.apiEndpoint + "adoptions").pipe(map(adoptions => {
      return adoptions;
    }));
  }

  public getAdoption(adoptionId: string): Observable<Adoption> {
    return this.http.get<Adoption>(environment.apiEndpoint + "adoptions/" + adoptionId).pipe(map(ad => {
      return ad;
    }));
  }

  public getAllAdoptionsFromOrg(): Observable<Adoption[]> {
    return this.http.get<Adoption[]>(environment.apiEndpoint + "adoptions/org/all", {headers: this.privateHeader.headers}).pipe(map( adoptions => {
      return adoptions;
    }));
  }

  public getAllAdoptionsForUserByStatus(): Observable<Adoption[]> {
    return this.http.get<Adoption[]>(environment.apiEndpoint + "adoptions/user/all/in-progress", {headers: this.privateHeader.headers}).pipe(map( adoptions => {
      return adoptions;
    }));
  }

  public getAllFinishedAdoptionsForUser(): Observable<Adoption[]> {
    return this.http.get<Adoption[]>(environment.apiEndpoint + "adoptions/user/all/closed", {headers: this.privateHeader.headers}).pipe(map( adoptions => {
      return adoptions;
    }));
  }

  public getAllAdoptionsForOrgByStatus(status: string): Observable<Adoption[]> {
    return this.http.get<Adoption[]>(environment.apiEndpoint + "adoptions/org/all/" + status, {headers: this.privateHeader.headers}).pipe(map( adoptions => {
      return adoptions;
    }));
  }

  public getAllAdoptionsInProgressForOrg(): Observable<Adoption[]> {
    return this.http.get<Adoption[]>(environment.apiEndpoint + "adoptions/org/all/in-progress", {headers: this.privateHeader.headers}).pipe(map( adoptions => {
      return adoptions;
    }));
  }

  public checkExistingAdoptionForAnimal(animalId: string): Observable<boolean> {
    return this.http.get<boolean>(environment.apiEndpoint + "adoptions/animal/current/" + animalId).pipe(map(ad => {
      return ad;
    }))
  }

  public saveStateOfAdoption(temp: any): Observable<any> {
    this.adoptionState = temp;
    return temp;
  }

  public getStateOfAdoption(): Observable<any> {
    return this.adoptionState;
  }

  public createContract(animalId: string): Observable<boolean> {
    return this.http.post<boolean>(environment.apiEndpoint + "file/upload/contract/"+animalId, "").pipe(map(ad => {
      return ad;
    }))
  }

}
