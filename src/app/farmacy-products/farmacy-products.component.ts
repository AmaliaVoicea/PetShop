import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FarmacyProduct } from '../models/farmacyProduct';
import { FarmacyService } from '../services/farmacy.service';

@Component({
  selector: 'farmacy-products',
  templateUrl: './farmacy-products.component.html',
  styleUrls: ['./farmacy-products.component.css']
})
export class FarmacyProductsComponent implements OnInit {

  farmacyProducts: FarmacyProduct[];
  filterTerm: string = "";
  mapSort1: Map<FarmacyProduct, number[]>;

  constructor(private farmacyService: FarmacyService, private router: Router) { }

  ngOnInit(): void {
    let myMap = new Map<FarmacyProduct, Array<number>>();
	  this.farmacyService.getAllFarmacyProducts().subscribe( farmacy =>{
      this.farmacyProducts = farmacy;
      console.log("farmacy: ",farmacy)
    });
  }

  goToFarmacyProductsDetails(farmacyProductId: string) {
    this.router.navigateByUrl("/farmacy/details/" + farmacyProductId);
  }

}
