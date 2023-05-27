import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserLoginResponse } from '../models/userLoginResponse';
import { Org } from '../models/org';
import { OrgLoginResponse } from '../models/orgLoginResponse';
import { OrgService } from '../services/org.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  registerFormUser: FormGroup;
  registerFormOrg: FormGroup;
  public otherErrorsDiv = null;
  public userButton = true;
  public orgButton = false;
  public loading = false;

  constructor(private formBuilder: FormBuilder, public userService: UserService, public orgService: OrgService, private router: Router) {}

  ngOnInit() {
    this.registerFormUser = this.formBuilder.group({
      userFirstName: ['', [Validators.required]],
      userLastName: ['', [Validators.required]],
      userBirthDate: ['', [Validators.required]],
      userEmail: ['', [Validators.required, Validators.email]],
      userPhone: ['', Validators.required],
      userAddress: ['', [Validators.required]],
      userPassword: ['', [Validators.required]]
    });

    this.registerFormOrg = this.formBuilder.group({
      orgName: ['', [Validators.required]],
      orgEmail: ['', [Validators.required, Validators.email]],
      orgPhone: ['', [Validators.required]],
      orgStartDate: ['', [Validators.required]],
      orgAddress: ['', [Validators.required]],
      orgPassword: ['', [Validators.required]]
    })
  }

  get fUser() { return this.registerFormUser.controls; }

  get fOrg() { return this.registerFormOrg.controls; }

  checkInput(input: any){
    return input.invalid && (input.dirty || input.touched);
  }

  public activateUserResponse: UserLoginResponse;
  public activateOrgResponse: OrgLoginResponse;
  public downloadedPk = false;

  signupUser(){
    console.log("date",  this.fUser['userBirthDate'].value)
    this.loading = true;
    if (this.registerFormUser.invalid) {
      return;
    }
    this.userService.CreateUser(<User>{
      email: this.fUser['userEmail'].value,
      birthdate: this.fUser['userBirthDate'].value,
      lastName: this.fUser['userLastName'].value,
      firstName: this.fUser['userFirstName'].value,
      phone: this.fUser['userPhone'].value,
      address: this.fUser['userAddress'].value,
      password: this.fUser['userPassword'].value
    }).subscribe(response => {
      this.router.navigateByUrl("/dashboard");
      this.loading = false;
    })
  }

  signupOrg(){
    this.loading = true;
    if (this.registerFormOrg.invalid) {
      return;
    }
    this.orgService.CreateOrg(<Org>{
      email: this.fOrg['orgEmail'].value,
      startDate: this.fOrg['orgStartDate'].value,
      orgName: this.fOrg['orgName'].value,
      phone: this.fOrg['orgPhone'].value,
      address: this.fOrg['orgAddress'].value,
      password: this.fOrg['orgPassword'].value,
    }).subscribe(response => {
      this.router.navigateByUrl("/dashboard");
      this.loading = false;
    })
  }

  userForm() {
    document.getElementById("user-button").style.backgroundColor = "#6C63FF";
    this.userButton = true;
    this.orgButton = false;
    document.getElementById("org-button").style.backgroundColor = "#DCDCDC";
  }

  orgForm() {
    document.getElementById("org-button").style.backgroundColor = "#6C63FF";
    this.orgButton = true;
    this.userButton = false;
    document.getElementById("user-button").style.backgroundColor = "#DCDCDC";
  }

}
