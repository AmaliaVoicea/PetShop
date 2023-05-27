import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Adoption } from '../models/adoption';
import { Animal } from '../models/animal';
import { Org } from '../models/org';
import { AdoptionsService } from '../services/adoptions.service';
import { AnimalService } from '../services/animal.service';
import { FeedbackService } from '../services/feedback.service';
import { OrgService } from '../services/org.service';
import { UploadFileService } from '../services/upload-file.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  orgs: Org[];
  detailsNotCompleteUser: boolean = false;
  detailsNotCompleteOrg: boolean = false;
  decodedRole: string;
  userLabel = "user";
  orgUserLabel = "org user";
  adminLabel = "admin";
  adoptionsInProgress: Adoption[] = [];
  adoptionsInProgressAltered: any[] = [];
  adoptionsInProgressUser: Adoption[] = [];
  adoptionsInProgressUserAltered: any[] = [];
  recentAnimals: Animal[] = [];
  recentAnimalsAltered: any[] = [];
  recentAnimalsForOrg: Animal[] = [];
  recentAnimalsAlteredForOrg: Animal[] = [];
  picturesFilePaths: string[] = [];
  topOrgs: Map<Org, Array<number>>;
  noOfComms: Map<Org, number>;

  constructor(private feedbackService: FeedbackService, private uploadService: UploadFileService, private router: Router, private userService: UserService, private orgService: OrgService, private adoptionService: AdoptionsService, private animalService: AnimalService) {
  }

  ngOnInit(): void {
    let myMap = new Map<Org, Array<number>>();
    if(this.userService.currentUserValue != null) {
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
          console.log(res);
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
    }
    if ( this.userService.currentUserValue != null ) {
      if (this.userService.currentUserValue.cnp == 0 || this.userService.currentUserValue.address == "" || this.userService.currentUserValue.birthdate == null ||
        this.userService.currentUserValue.email == "" || this.userService.currentUserValue.phone == "") {
          this.detailsNotCompleteUser = true;
      }
    }
    if ( this.orgService.currentOrgValue != null ) {
      if (this.orgService.currentOrgValue.address == null || this.orgService.currentOrgValue.email == null || this.orgService.currentOrgValue.payPalAccount == null ||
        this.orgService.currentOrgValue.phone == null ) {
          this.detailsNotCompleteOrg = true;
        }
    }
    this.decodeUserRole();

    if (this.orgService.currentOrgValue != null) {
      this.adoptionService.getAllAdoptionsInProgressForOrg().subscribe(r => {
        let temp: any;
        console.log(r);
        this.adoptionsInProgress = r;
        r.forEach((elem) => {
          temp = Object.assign({}, elem);
          this.adoptionsInProgressAltered.push(temp);
        })
      });
      this.animalService.getLatestAnimalsForOrg().subscribe(res => {
        let temp: any;
        console.log(res);
        this.recentAnimalsForOrg = res;
        res.forEach((elem) => {
          temp = Object.assign({}, elem);
          this.recentAnimalsAlteredForOrg.push(temp);
        })
      });
    }
    if(this.userService.currentUserValue != null) {
      this.adoptionService.getAllAdoptionsForUserByStatus().subscribe(r => {
        let temp: any;
        console.log(r);
        this.adoptionsInProgressUser = r;
        r.forEach((elem) => {
          temp = Object.assign({}, elem);
          this.adoptionsInProgressUserAltered.push(temp);
        })
      });
      this.animalService.getLatestAnimalsForOrg().subscribe(res => {
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
  }

  decodeUserRole(): void {
    let roleValue = "";
    if(this.userService.currentUserValue != null || this.orgService.currentOrgValue != null) {
      roleValue = this.userService.currentUserValue != null ? this.userService.currentUserValue.role : this.orgService.currentOrgValue.role;
        switch(+roleValue) {
            case 0:
                this.decodedRole = this.adminLabel;
                break;
            case 1:
                this.decodedRole = this.userLabel;
                break;
            case 2:
                this.decodedRole = this.orgUserLabel;
                break;
            default:
              this.decodedRole = "";
        }
    }
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

  goToAdoptionPage(adoptionId: string) {
    this.router.navigateByUrl("/adoption/"+adoptionId);
  }

  goToOrgDetail(id: string) {
    this.router.navigateByUrl("org/details/" + id);
  }

  goToAnimalDetails(animalId: string) {
    this.router.navigateByUrl("/animal/details/" + animalId);
  }

}
