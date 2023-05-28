import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FarmacyProduct } from '../models/farmacyProduct';
import { FarmacyService } from '../services/farmacy.service';
import { ShoppingCartService } from '../services/shoppingCart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'fproducts',
  templateUrl: './farmacy-products.component.html',
  styleUrls: ['./farmacy-products.component.css']
})
export class FarmacyProductsComponent implements OnInit {

  farmacyProducts: FarmacyProduct[];
  filterTerm: string = "";
  mapSort2: Map<FarmacyProduct, number>;

  constructor(private farmacyService: FarmacyService, private router: Router, private cartService: ShoppingCartService, private toastr: ToastrService ) { }

  ngOnInit(): void {
    let myMap = new Map<FarmacyProduct, number>();
	  this.farmacyService.getAllFarmacyProducts().subscribe( farmacyProducts => {
      this.farmacyProducts = farmacyProducts;
      for(var i = 0; i< this.farmacyProducts.length; i++){
          myMap.set(this.farmacyProducts[i],i);
      }
      this.mapSort2 = myMap;
      console.log("farmacy: ", farmacyProducts)

      this.farmacyProducts.forEach((a: any) =>{
        Object.assign(a, {quantity: 1, total: a.price});
      });

    });
  }

  goToFarmacyProductsDetails(farmacyProductId: string) {
    this.router.navigateByUrl("/farmacy/" + farmacyProductId);
  }

  addtocart(item: any){
    this.cartService.addToCart(item);
    this.toastr.success("Your item was added to the cart!");
  }

}
