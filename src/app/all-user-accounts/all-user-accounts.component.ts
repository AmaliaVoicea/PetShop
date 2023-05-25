import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { OrgService } from '../services/org.service';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-all-user-accounts',
  templateUrl: './all-user-accounts.component.html',
  styleUrls: ['./all-user-accounts.component.css']
})
export class AllUserAccountsComponent implements OnInit {

  decodedRole: string;
  allUsers: User[] = [];
  userLabel = "user";
  orgUserLabel = "org user";
  adminLabel = "admin";
  confirmDelete: boolean = false;
  modalRef: MatDialogRef<DeleteConfirmationDialogComponent> | null = null;
  constructor(public userService: UserService, public orgService: OrgService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.userService.getAllUsers().subscribe(res => {
      this.allUsers = res;
      this.allUsers.forEach( (elem) => {
        if (elem.role == "0") elem.role = this.adminLabel;
        else elem.role = this.userLabel;
      })
    });
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

  openDialog(user: any, type: string): void {
    console.log(user.id);
    this.modalRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '250px', 
      data: {
        userId: user.id,
        user: user,
        type: type
      }
    });
    // this.confirmDelete = this.responseModal.confirmDeletion;
    // console.log(this.confirmDelete);
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
