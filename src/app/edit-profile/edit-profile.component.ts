import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrgService } from '../services/org.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Org } from '../models/org';
import { DatePipe, ViewportScroller } from '@angular/common';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  user: User;
  org: Org;
  decodedRole: string = "";
  userLabel = "user";
  orgUserLabel = "org user";
  adminLabel = "admin";
  editUserDetails: FormGroup;
  editUserPassword: FormGroup;
  editOrgDetails: FormGroup;
  editOrgPassword: FormGroup;
  submitFlag : boolean = false;
  submitFlagNewUser: boolean = false;
  submitFlagNewOrg: boolean = false;
  userBirthDateString : string = '';
  userCreatedAtDateString : string = '';
  orgStartedDateString : string = '';
  orgCreatedDateString : string = '';
  successfullyUpdatedInfoUser: boolean = false;
  successfullyUpdatedPasswordUser: boolean = false;
  wrongUpdatedInfoUser: boolean = false;
  wrongUpdatedPasswordUser: boolean = false;
  successfullyUpdatedOrgInfo: boolean = false;
  successfullyUpdatedOrgPass: boolean = false;
  wrongUpdatedOrgInfo: boolean = false;
  wrongUpdatedOrgPass: boolean = false;
  errors = null;


  constructor(public userService: UserService, public orgService: OrgService, private router: Router, private fb: FormBuilder,public datepipe: DatePipe, private scroll: ViewportScroller) { }

  ngOnInit(): void {
    this.decodeUserRole();
    if(this.userService.currentUserValue != null) {
      this.user = new User(this.userService.currentUserValue);
      console.log(this.user);
       this.userBirthDateString = this.datepipe.transform(this.user.birthdate, 'yyyy-MM-dd');
       this.userCreatedAtDateString = this.datepipe.transform(this.user.createdDate, 'yyyy-MM-dd');
        console.log(this.userBirthDateString);
       this.initializeUserForm(this.user);
       this.initializeUserPasswordForm();
    }
    if (this.orgService.currentOrgValue != null) {
      this.org = new Org(this.orgService.currentOrgValue);
      this.orgStartedDateString = this.datepipe.transform(this.org.startDate, 'yyyy-MM-dd');
      this.orgCreatedDateString = this.datepipe.transform(this.org.createdDate, 'yyyy-MM-dd');
      console.log(this.org);
      this.initializeOrgForm(this.org);
      this.initializeOrgPasswordForm();
    }
  }
   
  checkInput(input: any) {
    return input.invalid && (input.dirty || input.touched);
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

  initializeUserForm(currentUser: User) {
    this.editUserDetails = this.fb.group({
      firstName: [currentUser.firstName],
      lastName: [currentUser.lastName],
      email: [currentUser.email],
      birthdate: [this.userBirthDateString],
      CNP: [currentUser.cnp, Validators.required],
      phone: [currentUser.phone, Validators.required],
      address: [currentUser.address, Validators.required]
      
    });
  }
  get f() { return this.editUserDetails.controls; }

  initializeUserPasswordForm() {
    this.editUserPassword = this.fb.group({
      currentPassword: [''],
      newPassword:[''],
      confirmNewPassword:['']
    })
  }
  get g() { return this.editUserPassword.controls; }

  initializeOrgForm(currentOrg: Org) {
    this.editOrgDetails = this.fb.group({
      orgName: [currentOrg.orgName],
      email: [currentOrg.email],
      startDate: [this.orgStartedDateString],
      address: [currentOrg.address, Validators.required],
      payPalAccount: [currentOrg.payPalAccount, Validators.required],
      description: [currentOrg.description],
      phone: [currentOrg.phone, Validators.required],
      
    });
  }
  get f1() { return this.editOrgDetails.controls; }

  initializeOrgPasswordForm() {
    this.editOrgPassword = this.fb.group({
      currentPassword: [''],
      newPassword:[''],
      confirmNewPassword:['']
    })
  }
  get g1() { return this.editOrgPassword.controls; }

  editProfile() {
    if(this.decodedRole == "user" || this.decodedRole == "admin") {
      const editedUser = new User({
        id: this.user.id,
        firstName: this.editUserDetails.value.firstName,
        lastName: this.editUserDetails.value.lastName,
        email: this.editUserDetails.value.email,
        birthdate: this.editUserDetails.value.birthdate,
        cnp: this.editUserDetails.value.CNP,
        phone: this.editUserDetails.value.phone,
        address: this.editUserDetails.value.address,
        //password: this.editUserDetails.value.newPassword
      });
      console.log(this.editUserDetails.valid)
      if(this.editUserDetails.valid){
        this.submitFlag = false;
        this.userService.updateProfile(editedUser).subscribe({ next: r=>{ console.log(r);
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
    }
      else{
        this.submitFlag =true;
      }
    } else if(this.decodedRole == "org user") {
      const editedOrg = new Org({
        id: this.org.id,
        orgName: this.editOrgDetails.value.orgName,
        email: this.editOrgDetails.value.email,
        startDate: this.editOrgDetails.value.startDate,
        payPalAccount: this.editOrgDetails.value.payPalAccount,
        phone: this.editOrgDetails.value.phone,
        address: this.editOrgDetails.value.address,
        description: this.editOrgDetails.value.description,
        //password: this.editOrgDetails.value.newPassword
      });
      if(this.editOrgDetails.valid){
        this.submitFlag = false;
        this.orgService.updateProfile(editedOrg).subscribe({ next: r=> {
          console.log(r);
          this.successfullyUpdatedOrgInfo = true;
          this.scroll.scrollToPosition([0,0]);
          setTimeout(()=>{this.successfullyUpdatedOrgInfo = false; window.location.reload();}, 3000);
        //window.location.reload();
      },
      error: error => { 
        this.errors = error;
        this.wrongUpdatedOrgInfo = true;
        this.scroll.scrollToPosition([0,0]);
        setTimeout(()=>{this.wrongUpdatedOrgInfo = false;}, 3000);
      }});
    }
      else{
        this.submitFlag =true;
      }
    }
  }

  editPassword() {
    console.log('before null check');
    if (this.userService.currentUserValue != null) {
      if(this.editUserPassword.value.currentPassword != null && this.editUserPassword.value.newPassword != null && this.editUserPassword.value.confirmNewPassword != null) {
        console.log('after null check');
        if(this.editUserPassword.value.newPassword == this.editUserPassword.value.confirmNewPassword) {
          this.submitFlagNewUser = false;
          this.userService.updateUserPassword(this.editUserPassword.value.currentPassword, this.editUserPassword.value.newPassword).subscribe({ next: r=> {
            console.log(r);
            this.successfullyUpdatedPasswordUser = true;
            this.scroll.scrollToPosition([0,0]);
            setTimeout(()=>{this.successfullyUpdatedPasswordUser = false; window.location.reload();}, 3000);
          },
          error: error => {
            this.errors = error;
            this.wrongUpdatedPasswordUser = true;
            this.scroll.scrollToPosition([0,0]);
            setTimeout(()=>{this.wrongUpdatedPasswordUser = false;}, 3000);
          }});
        } else {
          this.submitFlagNewUser = true;
        }
      }
    }
   
    if (this.orgService.currentOrgValue != null) {
      if (this.editOrgPassword.value.currentPassword != null && this.editOrgPassword.value.newPassword != null && this.editOrgPassword.value.confirmNewPassword != null) {
        if (this.editOrgPassword.value.newPassword == this.editOrgPassword.value.confirmNewPassword) {
          this.submitFlagNewOrg = false;
          this.orgService.updateOrgPassword(this.editOrgPassword.value.currentPassword, this.editOrgPassword.value.newPassword).subscribe({ next: r=> {
            console.log(r);
            this.successfullyUpdatedOrgPass = true;
            this.scroll.scrollToPosition([0,0]);
            setTimeout(()=>{this.successfullyUpdatedOrgPass = false;  window.location.reload();}, 3000);
          },
          error: error => {
            this.errors = error;
            this.wrongUpdatedOrgPass = true;
            this.scroll.scrollToPosition([0,0]);
            setTimeout(()=>{this.wrongUpdatedOrgPass = false;}, 3000);
          }});
        } else {
          this.submitFlagNewOrg = true;
        }
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

  goToMyProfile() {
    this.router.navigateByUrl("/edit-profile");
  }

  goToAllUsersList() {
    this.router.navigateByUrl("all/users");
  }

  goToAllUsersOrgList() {
    this.router.navigateByUrl("all/users/org");
  }

  goToMyAdoptions() {
    this.router.navigateByUrl("my-adoptions");
  }

  goToMyDonations() {
    this.router.navigateByUrl("my-donations");
  }

  goToMyActivity() {
    this.router.navigateByUrl("my-adoptions");
  }

  goToManageAnimals() {
    this.router.navigateByUrl("manage-animals");
  }

  goToOrgBenefits() {
    this.router.navigateByUrl("org-history");
  }

}
