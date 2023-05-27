import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { OrgService } from '../services/org.service';
import { AnimalService } from '../services/animal.service';
import { FeedbackService } from '../services/feedback.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FarmacyService } from '../services/farmacy.service';

@Component({
  selector: 'fproduct-details',
  templateUrl: './farmacy-products-details.component.html',
  styleUrls: ['./farmacy-products-details.component.css']
})

export class FarmacyProductsDetailsComponent implements OnInit {

  farmacyProductId: string;
  currentUser: any;
  currentFarmacyProduct: any;
  allFeedbacksWithComments: any[] = [];
  displayErrorMessage: boolean = false;
  public rateForm: FormGroup;
  currentRate = 0;
  readonly = true;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, public datepipe: DatePipe, private farmacyProductsService: FarmacyService, private animalService: AnimalService, private feedbackService: FeedbackService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.farmacyProductId = this.route.snapshot.paramMap.get('id');
    this.currentUser = this.userService.currentUserValue;
    this.farmacyProductsService.getFarmacyProductById(this.farmacyProductId).subscribe(res => {
      let temp: any;
      console.log(res);
      temp = Object.assign({}, res);
      this.currentFarmacyProduct = temp;
      if(this.currentFarmacyProduct.description == null) {
        this.currentFarmacyProduct.description = "-";
      }
      console.log(this.currentFarmacyProduct);
    })

    this.rateForm = this.fb.group({
      rating: [0],
      comment: ['']
    })
  }

  postFeedback() {}

}
