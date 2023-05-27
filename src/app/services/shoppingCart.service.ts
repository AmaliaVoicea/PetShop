import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ShoppingCart } from '../models/shoppingCart';
import { UserLoginResponse } from '../models/userLoginResponse';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  public cartItemList : any =[]
  public productsList = new BehaviorSubject<any>([]);

  // public currentUserSubject: BehaviorSubject<UserLoginResponse>;
  // public currentUser: Observable<UserLoginResponse>;
  // public isAdmin: boolean = false;
  
  // header = new HttpHeaders({
  //   'Content-Type': 'application/json'
  // });
  // privateHeader ={
  //     headers : new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       Authorization: 'Bearer ' + localStorage.getItem('token'),
  //     }),
  // };

  constructor(private http: HttpClient) {
  }

  getProducts(){
    return this.productsList.asObservable();
  }

  setProduct(product: any){
    this.cartItemList.push(...product);
    this.productsList.next(product);
  }

  addToCart(product: any){
    this.cartItemList.push(product);
    this.productsList.next(this.cartItemList);
    this.getTotalPrice();
    console.log(this.cartItemList);
  }

  getTotalPrice() : number{
    let grandTotal = 0;
    this.cartItemList.map((a: any)=>{
      grandTotal += a.total;
    })
    return grandTotal;
  }

  removeCartItem(product: any){
    this.cartItemList.map(((a: any, index: any) =>{
      if(product.id===a.id){
        this.cartItemList.splice(index, 1);
      }
    }))
    this.productsList.next(this.cartItemList);
  }

  removeAllCart(){
    this.cartItemList = [];
    this.productsList.next(this.cartItemList);
  }

  public getCartProducts(): Observable<ShoppingCart[]> {
    return this.http.get<ShoppingCart[]>(environment.apiEndpoint + "cart");
  }
}
