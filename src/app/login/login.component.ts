import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Org } from '../models/org';
import { User } from '../models/user';
import { OrgService } from '../services/org.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  @Input('isAdmin') public isAdmin: boolean = false;
  otherErrorsDiv = null;
  checkboxValue = false;
  loginFailed = false;
  errors = null;

  constructor(private userService: UserService, private orgService: OrgService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['']
    });
  }

  get f() { return this.loginForm.controls; }

  checkInput(input: any){
    return input.invalid && (input.dirty || input.touched);
  }

  async login() {
    this.otherErrorsDiv = null;
    this.loginForm.markAllAsTouched();
    let shouldReturn = false;
    if (this.loginForm.invalid) {
      shouldReturn = true;
    }

    if(shouldReturn) return;

    if(!this.isAdmin && !this.checkboxValue){
      console.log("intra aici ");
      // this.userService.LoginUser(<User>{
      //   email: this.f['email'].value,
      //   password: this.f['password'].value
      // }).subscribe({next: loginResponse => {
      //   console.log("loginResponse ", loginResponse);
      //   if (loginResponse.role == "0") {
      //     this.router.navigateByUrl("/edit-profile");
      //   } else {
      //     this.router.navigateByUrl("/dashboard");
      //   }
      // },
      // error: error => {
      //   this.loginFailed = true;
      //   this.errors = error;
      //   setTimeout(()=>{this.loginFailed = false;}, 3000);
      // }});

      this.userService.LoginUser(<User>{
        email: this.f['email'].value,
        password: this.f['password'].value
      }).subscribe(res =>{

        console.log("login response", res);
        this.router.navigateByUrl("/home");
      },
      err =>{
        console.error("API error:", err);

      })

    }
    else if (!this.isAdmin && this.checkboxValue){
      this.orgService.LoginOrgUser(<Org>{
        email: this.f['email'].value,
        password: this.f['password'].value
      }).subscribe({next: loginResponse => {
        console.log(loginResponse);
        this.router.navigateByUrl("/dashboard");
      },
      error: error => {
        this.loginFailed = true;
        this.errors = error;
        setTimeout(()=>{this.loginFailed = false;}, 3000);
      }});
    }
  }
  check(event){
    this.checkboxValue = event.checked;
  }

  goToSignUp() {
    this.router.navigateByUrl("signup");
  }
}
