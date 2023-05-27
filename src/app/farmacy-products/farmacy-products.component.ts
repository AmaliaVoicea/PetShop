import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FarmacyProduct } from '../models/farmacyProduct';
import { FarmacyService } from '../services/farmacy.service';

@Component({
  selector: 'fproducts',
  templateUrl: './farmacy-products.component.html',
  styleUrls: ['./farmacy-products.component.css']
})
export class FarmacyProductsComponent implements OnInit {

  farmacyProducts: FarmacyProduct[];
  filterTerm: string = "";
  mapSort2: Map<FarmacyProduct, number>;

  constructor(private farmacyService: FarmacyService, private router: Router) { }

  ngOnInit(): void {
    let myMap = new Map<FarmacyProduct, number>();
	  this.farmacyService.getAllFarmacyProducts().subscribe( farmacyProducts => {
      this.farmacyProducts = farmacyProducts;
      // for(var i = 0; i< this.farmacyProducts.length; i++){
      //     myMap.set(this.farmacyProducts[i],i);
      // }
      // this.mapSort2 = myMap;
      console.log("farmacy: ", farmacyProducts)

    });

    // let myMap = new Map<FarmacyProduct, Array<number>>();
	  // this.farmacyService.getAllFarmacyProducts().subscribe( farmacy =>{
    //   this.farmacyProducts = farmacy;
    //   console.log("farmacy: ",farmacy)
    // });
  }

  goToFarmacyProductsDetails(farmacyProductId: string) {
    this.router.navigateByUrl("/farmacy/" + farmacyProductId);
  }

}
