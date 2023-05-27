import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { OrgService } from '../services/org.service';
import { UserService } from '../services/user.service';
import { ShoppingCartService } from '../services/shoppingCart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit,OnChanges {

  public totalItem: number = 0;

  constructor(public userService: UserService, public orgService: OrgService, private router: Router, private cartService: ShoppingCartService) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
    this.cartService.getProducts().subscribe(res=>{
      this.totalItem = res.length;
      console.log('item no '+res.length);
    })
  }
  userLoggedIn: boolean = false;
  userOrgLoggedIn: boolean = false;
  username:string = '';
  decodedRole: string = "";
  userLabel = "user";
  orgUserLabel = "org user";
  adminLabel = "admin";
  emptyLabel = "";
  currentOrgValue: any;
  currentUserValue: any;


  ngOnInit(): void {
    console.log('currorg ' + this.orgService.currentOrgValue);
    console.log('currUser ' + this.userService.currentUserValue);
    if(this.userService.currentUserValue != null){
      this.userLoggedIn = true;
      this.currentUserValue = this.userService.currentUserValue;
      this.username = this.userService.currentUserValue.firstName + ' ' + this.userService.currentUserValue.lastName;
    } else if (this.orgService.currentOrgValue != null) {
      this.userOrgLoggedIn = true;
      this.currentOrgValue = this.orgService.currentOrgValue;
      this.username = this.orgService.currentOrgValue.orgName;
      console.log('username ' + this.username);
      console.log('logged ' + this.userOrgLoggedIn);
    }
    if(this.userLoggedIn) {
      this.userService.currentUser.subscribe(user => {
        if(user == null){
          this.username = '';
          this.userLoggedIn = false;
        }
        else{
          this.username = user.firstName + ' ' + user.lastName;
          this.userLoggedIn = true;
        }
      });
    } else if (this.userOrgLoggedIn) {
      this.orgService.currentOrg.subscribe(org => {
        if(org == null){
          this.username = '';
          this.userOrgLoggedIn = false;
        }
        else{
          this.username = org.orgName;
          this.userOrgLoggedIn = true;
        }
      });
    }
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
              this.decodedRole = this.emptyLabel;
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

  goToDonationPage(){
    this.router.navigateByUrl("/new-donation");
  }

  goToHomePage() {
    if (this.userService.currentUserValue != null || this.orgService.currentOrgValue != null) {
      this.router.navigateByUrl("/dashboard");
    }
    if (this.orgService.currentOrgValue == null && this.userService.currentUserValue == null) {
      this.router.navigateByUrl("/home");
    }
  }

  goToContactForm() {
    this.router.navigateByUrl("/contact-us");
  }

  goToMap() {
    this.router.navigateByUrl("/map");
  }

  goToAllOrgs() {
    this.router.navigateByUrl("/all/organizations");
  }

  goToHomePageLogo() {
    this.router.navigateByUrl("/home");
  }

  goToAllFoods() {
    this.router.navigateByUrl("/foods");
  }

  goToFarmacyProducts(){
    this.router.navigateByUrl("/farmacy");
  }

  goToAllAccessories() {
    this.router.navigateByUrl("/accessories");
  }

  goToShoppingCart(){
    this.router.navigateByUrl("/cart");
  }

}
