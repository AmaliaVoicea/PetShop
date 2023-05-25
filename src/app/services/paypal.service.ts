import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {
  privateHeader ={
    headers : new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    }),
  };
  header = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  baseUrl = 'https://api-m.sandbox.paypal.com'
  constructor(private http: HttpClient) { }
  autentificarePayPal(id: number) {
    return this.http.delete(this.baseUrl + '/cazare/Id?Id=' + id.toString(), { headers: this.privateHeader.headers });
  }
  
}





export class Order {
  public email: string;
  public jwt: string;
  public address: string;
  public orgName: string;
  public phone: string;
  public startDate: Date;
  public description: string;
  public role: string;

  constructor(init: Partial<Order>) {
      Object.assign(this, init);
  }
}