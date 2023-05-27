import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FoodProduct } from '../models/foodProduct';
import { FoodService } from '../services/food.service';

@Component({
  selector: 'foods-list',
  templateUrl: './foods-list.component.html',
  styleUrls: ['./foods-list.component.css']
})
export class FoodsListComponent implements OnInit {

  foodProducts: FoodProduct[];
  filterTerm: string = "";
  mapSort1: Map<FoodProduct, number[]>;

  constructor(private foodService: FoodService, private router: Router) { }

  ngOnInit(): void {
    let myMap = new Map<FoodProduct, Array<number>>();
	  this.foodService.getAllFoodProducts().subscribe( foods =>{
      this.foodProducts = foods;
      console.log("foods: ",foods)
    });
  }

  goToFacebook() {
    window.location.href = "https://www.facebook.com/";
  }

  goToInstagram() {
    window.location.href = "https://www.instagram.com/";
  }

  goToTwitter() {
    window.location.href = "https://twitter.com/";
  }

  goToFoodDetails(foodId: string) {
    this.router.navigateByUrl("/foods/" + foodId);
  }

}
