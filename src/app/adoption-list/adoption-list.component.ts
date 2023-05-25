import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Adoption } from '../models/adoption';
import { AdoptionsService } from '../services/adoptions.service';
import { OrgService } from '../services/org.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-adoption-list',
  templateUrl: './adoption-list.component.html',
  styleUrls: ['./adoption-list.component.css']
})
export class AdoptionListComponent implements OnInit {

  decodedRole: string;
  userLabel = "user";
  orgUserLabel = "org user";
  adminLabel = "admin";
  userAdoptions: Adoption[] = [];
  userAdoptionsAltered: any[] = [];

  constructor(public datepipe: DatePipe, private adoptionService: AdoptionsService, private userService: UserService, private orgService: OrgService, private router: Router) { }

  ngOnInit() {
    this.decodeUserRole();
    this.adoptionService.getAllFinishedAdoptionsForUser().subscribe(res => {
      console.log(res);
      this.userAdoptions = res;
      res.forEach((elem) => {
        let temp: any;
        temp = Object.assign({}, elem);
        temp.dateString = this.datepipe.transform(elem.closedAt, 'yyyy-MM-dd');
        this.userAdoptionsAltered.push(elem);
      })
    })
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

  signOut(){
    if (this.userService.currentUserValue != null) {
      this.userService.LogoutUser().subscribe(response => {});
    }
    if (this.orgService.currentOrgValue != null) {
      this.orgService.LogoutOrgUser().subscribe(resp => {});
    }
    this.router.navigateByUrl("/home");
  }

  goToEdit() {
    this.router.navigateByUrl("/edit-profile");
  }

  goToMyAdoptions() {
    this.router.navigateByUrl("my-adoptions");
  }

  goToMyDonations() {
    this.router.navigateByUrl("my-donations");
  }

  openContract(adoptionId: string) {
    window.open("./../../assets/documents/adoptions/"+adoptionId + ".html", '_blank')
  }

}
