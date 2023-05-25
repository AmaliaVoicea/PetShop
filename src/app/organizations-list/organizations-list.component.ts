import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Org } from '../models/org';
import { FeedbackService } from '../services/feedback.service';
import { OrgService } from '../services/org.service';

@Component({
  selector: 'app-organizations-list',
  templateUrl: './organizations-list.component.html',
  styleUrls: ['./organizations-list.component.css']
})
export class OrganizationsListComponent implements OnInit {

  orgs: Org[];
  filterTerm: string = "";
  mapSort1: Map<Org, number[]>;

  constructor(private feedbackService: FeedbackService, private orgService: OrgService, private router: Router) { }

  ngOnInit(): void {
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
            this.mapSort1 = new Map([...myMap.entries()].sort((a,b) =>  a < b ? 1 : a > b ? -1 : 0));
          }
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

  goToOrgDetails(orgId: string) {
    this.router.navigateByUrl("/org/details/" + orgId);
  }

}
