import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FoodService } from '../services/food.service';

@Component({
  selector: 'food-details',
  templateUrl: './food-details.component.html',
  styleUrls: ['./food-details.component.css']
})

export class FoodDetailsComponent implements OnInit {

  foodId: string;
  currentUser: any;
  currentfood: any;
  allFeedbacksWithComments: any[] = [];
  displayErrorMessage: boolean = false;
  public rateForm: FormGroup;
  currentRate = 0;
  readonly = true;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, public datepipe: DatePipe, private foodService: FoodService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.foodId = this.route.snapshot.paramMap.get('id');
    this.currentUser = this.userService.currentUserValue;
    this.foodService.getFoodById(this.foodId).subscribe(res => {
      let temp: any;
      console.log(res);
      temp = Object.assign({}, res);
      this.currentfood = temp;
      if(this.currentfood.description == null) {
        this.currentfood.description = "-";
      }
      console.log(this.currentfood);
    })

    this.rateForm = this.fb.group({
      rating: [0],
      comment: ['']
    })
  }

  postFeedback() {}

}
