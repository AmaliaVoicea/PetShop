import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FoodProduct } from '../models/foodProduct';
import { FoodService } from '../services/food.service';
import { ShoppingCartService } from '../services/shoppingCart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'foods-list',
  templateUrl: './foods-list.component.html',
  styleUrls: ['./foods-list.component.css']
})
export class FoodsListComponent implements OnInit {

  foodProducts: FoodProduct[];
  filterTerm: string = "";
  mapSort1: Map<FoodProduct, number[]>;

  constructor(private foodService: FoodService, private router: Router, private cartService: ShoppingCartService, private toastr: ToastrService) { }

  ngOnInit(): void {
    let myMap = new Map<FoodProduct, Array<number>>();
	  this.foodService.getAllFoodProducts().subscribe( foods =>{
      this.foodProducts = foods;
      console.log("foods: ",foods)

      this.foodProducts.forEach((a: any) =>{
        Object.assign(a, {quantity: 1, total: a.price});
      });
    });
  }

  goToFoodDetails(foodId: string) {
    this.router.navigateByUrl("/foods/" + foodId);
  }

  addtocart(item: any){
    this.cartService.addToCart(item);
    this.toastr.success("Your item was added to the cart!");
  }

}
