import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Donation } from '../models/donation';
import { UserLoginResponse } from '../models/userLoginResponse';
import { DonationService } from '../services/donation.service';
import { OrgService } from '../services/org.service';
import { UserService } from '../services/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.css']
})
export class DonationListComponent implements OnInit {

  decodedRole: string;
  userLabel = "user";
  orgUserLabel = "org user";
  adminLabel = "admin";
  public donationsList: Donation[] = [];
  cUser: UserLoginResponse;
  temporaryObj: any[] = [];

  constructor(public userService: UserService, public orgService: OrgService, private router: Router, private donationService: DonationService, public datepipe: DatePipe) { }

  ngOnInit() {
    this.decodeUserRole();
    this.getUserDonations();
    //this.cloneObject();
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

  cloneObject() {
    let temp: any;
    console.log('sz ' + this.donationsList.length);
    this.donationsList.forEach((elem) => {
      temp = Object.assign({}, elem);
      console.log(temp);
      temp.donationDateString = this.datepipe.transform(elem.donationDate, 'yyyy-MM-dd');
      console.log('str date ' + temp.donationDateString)
      this.temporaryObj.push(temp);
    })
    console.log('temp ' + this.temporaryObj);
  }

  getUserDonations() {
    this.donationService.getAllDonationsByUserId().subscribe(res=>{
      console.log(res);
      let temp: any;
      this.donationsList = res;
      res.forEach((elem) => {
        temp = Object.assign({}, elem);
        console.log(temp);
        temp.donationDateString = this.datepipe.transform(elem.donationDate, 'yyyy-MM-dd');
        console.log('str date ' + temp.donationDateString)
        this.orgService.getOrgById(elem.ongId).subscribe(rez => {
          temp.orgName = rez.orgName;
          console.log('temp org ' + temp.orgName);
        })
        this.temporaryObj.push(temp);
      })
      console.log(this.donationsList);
      console.log('temp ' + this.temporaryObj);
    });
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

}
