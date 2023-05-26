import { Component, OnInit } from '@angular/core';
import { AccessoryProduct } from '../models/accessoryProduct';
import { AccessoryService } from '../services/accessory.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accessory-list',
  templateUrl: './accessory-list.component.html',
  styleUrls: ['./accessory-list.component.css']
})
export class AccessoryListComponent implements OnInit {

  accessoryProducts: AccessoryProduct[];
  filterTerm: string = "";
  mapSort1: Map<AccessoryProduct, number>;

  constructor(private accessoryService: AccessoryService, private router: Router) { }

  ngOnInit(): void {
    let myMap = new Map<AccessoryProduct, number>();
	  this.accessoryService.getAllAccessoryProducts().subscribe( accessories =>{
      this.accessoryProducts = accessories;
      for(var i = 0; i< this.accessoryProducts.length; i++){
          myMap.set(this.accessoryProducts[i],i);
      }
      this.mapSort1 = myMap;
      console.log("accessories: ", accessories)
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

  goToAccessoryDetails(accessoryId: string) {
    this.router.navigateByUrl("/accessories/" + accessoryId);
  }

}
