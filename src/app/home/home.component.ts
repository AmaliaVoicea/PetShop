import { Component, OnInit } from '@angular/core';
import { Org } from '../models/org';
import { OrgService } from '../services/org.service';
import { Router } from '@angular/router';
import { FeedbackService } from '../services/feedback.service';
import { AnimalService } from '../services/animal.service';
import { Animal } from '../models/animal';
import { UploadFileService } from '../services/upload-file.service';
import { Adoption } from '../models/adoption';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  orgs: Org[];
  topOrgs: Map<Org, Array<number>>;
  noOfComms: Map<Org, number>;
  recentAnimals: Animal[] = [];
  recentAnimalsAltered: any[] = [];
  picturesFilePaths: string[];
  adoptionsInProgress: Adoption[] = [];
  adoptionsInProgressAltered: any[] = [];
  filterTerm: string = "";

	constructor(private uploadService: UploadFileService, private animalService: AnimalService, private orgService: OrgService, private router: Router, private feedbackService: FeedbackService) { }

	ngOnInit() {
    let myMap = new Map<Org, Array<number>>();
	  this.orgService.getAllOrgs().subscribe(r=>{
      this.orgs = r;
      let orgRating = 0.0;
      r.forEach((elem) => {
        let calculateFeedback = 0;
        let ratingsCount = 0.0;
        let commentCount = 0;
        let userIdsList = [];
        this.feedbackService.getAllFeedbacksFromOrg(elem.id).subscribe(res => {
          let tempo: any;
          // tempo = res.filter(obj => obj.userId == this.userService.currentUserValue?.id && obj.rating != 0);
          // if (Object.keys(tempo).length > 1) {
          //   tempo = tempo.sort((a, b) => a.addedAt < b.addedAt ? -1 : a.addedAt > b.addedAt ? 1 : 0);
          //   calculateFeedback+=
          // }
          res.forEach((elem) => {
            if(elem.rating != 0 && elem.rating != null && !userIdsList.includes(elem.userId)) {
              tempo = res.filter(obj => obj.userId == elem.userId && obj.rating != 0);
              if(Object.keys(tempo).length > 1) {
                tempo = tempo.sort((a, b) => a.addedAt < b.addedAt ? 1 : a.addedAt > b.addedAt ? -1 : 0);
                calculateFeedback += tempo[0].rating;
                ratingsCount++;
                userIdsList.push(elem.userId);
              } 
              else {
                calculateFeedback += elem.rating;
                ratingsCount++;
              }
            }
            if(elem.comment != null && elem.comment != "") {
              commentCount++;
            }
          })
          if (ratingsCount != 0) {
            orgRating = calculateFeedback / ratingsCount;
            myMap.set(elem, [orgRating, commentCount]);
            const mapSort1 = new Map([...myMap.entries()].sort((a,b) =>  a < b ? 1 : a > b ? -1 : 0));
            this.topOrgs = new Map([...mapSort1.entries()].slice(0,3));
          }
      })
      })
    });  
    this.animalService.getLatest().subscribe(res => {
      let temp: any;
      console.log(res);
      this.recentAnimals = res;
      res.forEach((elem) => {
        temp = Object.assign({}, elem);
        this.recentAnimalsAltered.push(temp);
        this.uploadService.getImageNames(elem.id).subscribe(res => {
          this.picturesFilePaths = res;
          console.log(res);
        })
      })
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

  goToOrgDetail(id: string) {
    this.router.navigateByUrl("org/details/" + id);
  }

  goToAnimalDetails(animalId: string) {
    this.router.navigateByUrl("/animal/details/" + animalId);
  }
}
