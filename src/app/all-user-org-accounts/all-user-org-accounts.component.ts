import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Org } from '../models/org';
import { OrgService } from '../services/org.service';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';


@Component({
  selector: 'app-all-user-org-accounts',
  templateUrl: './all-user-org-accounts.component.html',
  styleUrls: ['./all-user-org-accounts.component.css']
})
export class AllUserOrgAccountsComponent implements OnInit {

  decodedRole: string;
  userLabel = "user";
  orgUserLabel = "org user";
  adminLabel = "admin";
  allUserOrgs: Org[] = [];
  modalRef: MatDialogRef<DeleteConfirmationDialogComponent> | null = null;

  constructor(public userService: UserService, public orgService: OrgService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.orgService.getAllOrgs().subscribe(res => {
      this.allUserOrgs = res;
      this.allUserOrgs.forEach( (elem) => {
        if (elem.role == "2") elem.role = this.orgUserLabel;
      })
    })
    this.decodeUserRole();
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

  openDialog(org: any, type: string): void {
    console.log(org.id);
    this.modalRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '250px', 
      data: {
        userId: org.id,
        type: type
      }
    });
    // this.confirmDelete = this.responseModal.confirmDeletion;
    // console.log(this.confirmDelete);
  }

  signOut(){
    this.userService.LogoutUser().subscribe(response => {
    });
    this.router.navigateByUrl("/home");
  }

  goToMyProfile() {
    this.router.navigateByUrl("/edit-profile");
  }

  goToAllUsersList() {
    this.router.navigateByUrl("all/users");
  }

  goToAllUsersOrgList() {
    this.router.navigateByUrl("all/users/org");
  }

}
