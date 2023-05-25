import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Donation } from '../models/donation';

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  header = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  privateHeader ={
      headers : new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
  };
  newDonation: Donation;
  donationList: Donation[] = [];
  donationListId: Donation[] = [];
  specificDonation: Donation; 

  constructor(private http: HttpClient) { }

  public AddDonation(donation: Donation): Observable<Donation> {
    return this.http.post<Donation>(environment.apiEndpoint + "donations/createDonation", donation, 
    { headers: this.privateHeader.headers }).pipe(map(donation => {
      this.newDonation = donation;
      return donation;
    }))
  }

  public getDonation(donationId: string): Observable<Donation> {
    return this.http.get<Donation>(environment.apiEndpoint + "donations/" + donationId).pipe(map(dn => {
        this.specificDonation = dn;
        return dn;
    }));
  }

  public getAllDonations(): Observable<Donation[]> {
    return this.http.get<Donation[]>(environment.apiEndpoint + "donations").pipe(map(list => {
        this.donationList = list;
        return list;
    }));
  }

  public getAllDonationsByUserId(): Observable<Donation[]> {
    console.log(localStorage.getItem('token'))
    return this.http.get<Donation[]>(environment.apiEndpoint + "donations/user/all");
  }

  public getAllDonationsByOrgId(): Observable<Donation[]> {
    return this.http.get<Donation[]>(environment.apiEndpoint + "donations/org/all", {headers: this.privateHeader.headers});
  }
}
