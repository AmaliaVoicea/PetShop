import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrgService } from '../services/org.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  decodedRole: string;
  userLabel = "user";
  orgUserLabel = "org user";
  adminLabel = "admin";

  constructor(public userService: UserService, public orgService: OrgService, private router: Router) { }

  ngOnInit() {
    console.log("Aici");
    this.decodeUserRole();
  }

  decodeUserRole(): void {
    let roleValue = "";
    if(this.userService.currentUserValue != null || this.orgService.currentOrgValue != null) {
      roleValue = this.userService.currentUserValue != null ? this.userService.currentUserValue.role : this.orgService.currentOrgValue.role;
      console.log(roleValue);
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

}
