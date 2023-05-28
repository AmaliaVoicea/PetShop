import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../services/shoppingCart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  public products : any = [];
  public grandTotal : number = 0;

  constructor(private cartService: ShoppingCartService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.cartService.getProducts().subscribe(res=>{
      this.products = res;
      this.grandTotal = this.cartService.getTotalPrice();
    })
  }

  removeItem(item: any){
    this.cartService.removeCartItem(item);
    this.toastr.error("The item was removed from the cart!");
  }

  emptyCart(){
    this.cartService.removeAllCart();
    this.toastr.error("All the products were removed from the cart!");
  }

}
