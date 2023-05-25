import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { OrgService } from '../services/org.service';
import { ViewportScroller } from '@angular/common';
@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.css']
})
export class DeleteConfirmationDialogComponent implements OnInit {

  successfullyUpdatedInfoUser: boolean = false;
  errors = null;
  wrongUpdatedInfoUser: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>, private userService : UserService, private scroll: ViewportScroller, private orgService: OrgService) { }
  ngOnInit(): void {
  }

  manageUsers() {
    // if(this.data.type == "user") {
    //   this.userService.Delete(this.data.userId).subscribe(r=> console.log(r));
    // } else if (this.data.type == "org") {
    //   this.orgService.Delete(this.data.userId).subscribe(r => console.log(r));
    // }

    switch(this.data.type) {
      case "user": {
        this.userService.Delete(this.data.userId).subscribe({ next: r=>{ console.log(r);
          this.successfullyUpdatedInfoUser = true;
          this.scroll.scrollToPosition([0,0]);
          setTimeout(()=>{this.successfullyUpdatedInfoUser = false; window.location.reload();}, 3000);
        },
        error: error => {
          this.errors = error;
          this.wrongUpdatedInfoUser = true;
          this.scroll.scrollToPosition([0,0]);
          setTimeout(()=>{this.wrongUpdatedInfoUser = false;}, 3000);
          //window.location.reload();
        }});
        break;
      }
      case "org": {
        this.orgService.Delete(this.data.userId).subscribe({ next: r=>{ console.log(r);
          this.successfullyUpdatedInfoUser = true;
          this.scroll.scrollToPosition([0,0]);
          setTimeout(()=>{this.successfullyUpdatedInfoUser = false; window.location.reload();}, 3000);
        },
        error: error => {
          this.errors = error;
          this.wrongUpdatedInfoUser = true;
          this.scroll.scrollToPosition([0,0]);
          setTimeout(()=>{this.wrongUpdatedInfoUser = false;}, 3000);
          //window.location.reload();
        }});
        break;
      }
      case "change role": {
        console.log(this.data.user.role);
        if(this.data.user.role == "admin") {
          this.data.user.role = "1";
          console.log(this.data.user.role);
        } else if(this.data.user.role == "user"){
          this.data.user.role = "0";
          console.log(this.data.user.role);
        }
        this.userService.updateRole(this.data.user).subscribe({ next: r=>{ console.log(r);
        this.successfullyUpdatedInfoUser = true;
        this.scroll.scrollToPosition([0,0]);
        setTimeout(()=>{this.successfullyUpdatedInfoUser = false; window.location.reload();}, 3000);
      },
      error: error => {
        this.errors = error;
        this.wrongUpdatedInfoUser = true;
        this.scroll.scrollToPosition([0,0]);
        setTimeout(()=>{this.wrongUpdatedInfoUser = false;}, 3000);
        //window.location.reload();
      }});
        break;
      }
    }
  }

}
