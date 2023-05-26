import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Animal } from '../models/animal';
import { Org } from '../models/org';
import { AnimalService } from '../services/animal.service';
import { OrgService } from '../services/org.service';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Rating } from 'mdb-ui-kit';
import { FeedbackService } from '../services/feedback.service';
import { Feedback } from '../models/feedback';
import { DatePipe } from '@angular/common';
import { UserService } from '../services/user.service';
import { UploadFileService } from '../services/upload-file.service';

@Component({
  selector: 'app-org-details',
  templateUrl: './org-details.component.html',
  styleUrls: ['./org-details.component.css']
})

export class OrgDetailsComponent implements OnInit {

  orgId: string;
  currentOrg: any;
  allAnimals: Animal[] = [];
  allFeedbacksWithComments: any[] = [];
  allFeedbacks: Feedback[] = [];
  orgRating: number = 0.0;
  public rateForm: FormGroup;
  readonly = true;
  ratingsCount = 0;
  commentsCount = 0;
  currentRate = 0;
  errors = null;
  displayErrorMessage: boolean = false;
  currentUser: any;
  userIdsList: string[]=[];
  picturesFilePaths: string[] = [];

  constructor(private uploadService: UploadFileService, private route: ActivatedRoute, private router: Router, private userService: UserService, public datepipe: DatePipe, private orgService: OrgService, private animalService: AnimalService, private feedbackService: FeedbackService, private fb: FormBuilder) { }

  ngOnInit(): void {
    let calculateFeedback = 0;
    this.orgId = this.route.snapshot.paramMap.get('id');
    this.currentUser = this.userService.currentUserValue;
    this.orgService.getOrgById(this.orgId).subscribe(res => {
      let temp: any;
      console.log(res);
      temp = Object.assign({}, res);
      temp.startDateString = this.datepipe.transform(res.startDate, 'yyyy-MM-dd');
      this.currentOrg = temp;
      if(this.currentOrg.payPalAccount == null) {
        this.currentOrg.payPalAccount = "-";
      }
      if(this.currentOrg.description == null) {
        this.currentOrg.description = "-";
      }
      console.log(this.currentOrg);
    })
    this.animalService.getAllAnimalsFromOrg(this.orgId).subscribe(res=> {
      console.log(res);
      this.allAnimals = res;
      console.log(this.allAnimals);
      res.forEach((elem) => {
        this.uploadService.getImageNames(elem.id).subscribe(res => {
          this.picturesFilePaths = res;
          console.log(res);
        })
      })
      
    });

    this.rateForm = this.fb.group({
      rating: [0],
      comment: ['']
    })

    this.feedbackService.getAllFeedbacksFromOrg(this.orgId).subscribe(res => {
      let temp: any;
      let tempo: any;
      console.log(res);
      this.allFeedbacks = res;
      res.forEach((elem) => {
        if(elem.comment != null) {
          temp = Object.assign({}, elem);
          this.commentsCount++;
          temp.createdDateString = this.datepipe.transform(elem.addedAt, 'yyyy-MM-dd');
          this.allFeedbacksWithComments.push(temp);
        }
        if(elem.rating != 0 && elem.rating != null && !this.userIdsList.includes(elem.userId)) {
          tempo = res.filter(obj => obj.userId == elem.userId && obj.rating != 0);
          console.log(tempo);
          console.log(Object.keys(tempo).length);
          if(Object.keys(tempo).length > 1) {
            tempo = tempo.sort((a, b) => a.addedAt < b.addedAt ? 1 : a.addedAt > b.addedAt ? -1 : 0);
            console.log(tempo);
            console.log(calculateFeedback);
            calculateFeedback += tempo[0].rating;
            console.log(calculateFeedback);
            this.ratingsCount++;
            this.userIdsList.push(elem.userId);
          } 
          else {
            calculateFeedback += elem.rating;
            this.ratingsCount++;
          }
          
        }
      })
      this.allFeedbacksWithComments = this.allFeedbacksWithComments.sort((a, b) => a.addedAt < b.addedAt ? 1 : a.addedAt > b.addedAt ? -1 : 0);
      console.log(calculateFeedback);
      console.log(this.ratingsCount);
      this.orgRating = calculateFeedback / this.ratingsCount;
      console.log(this.orgRating);
    })
  }

  get f() { return this.rateForm.controls; }


  postFeedback() {
    this.rateForm.markAllAsTouched();
    let shouldReturn = false;

    if (this.rateForm.invalid) {
      shouldReturn = true;
    }

    if(shouldReturn) return;
    console.log('before valid check');
    if (this.rateForm.valid) {
      console.log('after valid check');
      console.log(this.f['rating'].value);
      console.log(this.f['comment'].value);
      this.feedbackService.addNewFeedback(<Feedback>{
        rating: this.f['rating'].value,
        comment: this.f['comment'].value,
        orgId: this.orgId
      }).subscribe({ next: createResp => {
        console.log(createResp);
        setTimeout(()=>{window.location.reload();}, 5000);
      },
      error: error => {
        this.errors = error;
        this.displayErrorMessage = true;
        setTimeout(()=>{this.displayErrorMessage=false;}, 5000);
      }})
    }
  }

  goToAnimalDetail(id: string) {
    this.router.navigateByUrl("/animal/details/"+id);
  }

}
