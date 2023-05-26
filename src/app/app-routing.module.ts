import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { AuthGuard } from './services/auth.guard';
import { AddDonationComponent } from './add-donation/add-donation.component';
import { AdoptionListComponent } from './adoption-list/adoption-list.component';
import { AllUserAccountsComponent } from './all-user-accounts/all-user-accounts.component';
import { AllUserOrgAccountsComponent } from './all-user-org-accounts/all-user-org-accounts.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DonationListComponent } from './donation-list/donation-list.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { OrgDetailsComponent } from './org-details/org-details.component';
import { OrganizationsListComponent } from './organizations-list/organizations-list.component';
import { ManageAnimalsComponent } from './manage-animals/manage-animals.component';
import { OrgBenefitsHistoryComponent } from './org-benefits-history/org-benefits-history.component';
import { AnimalDetailComponent } from './animal-detail/animal-detail.component';
import { AdoptionProcessComponent } from './adoption-process/adoption-process.component';
import { FoodsListComponent } from './foods-list/foods-list.component';
import { AccessoryListComponent } from './accessory-list/accessory-list.component';
import { AccessoryDetailsComponent } from './accessory-details/accessory-details.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'confirm',
    canActivate: [AuthGuard],
    component: ConfirmationComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'my-account',
    canActivate: [AuthGuard],
    component: MyAccountComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent
  },
  {
    path: 'my-adoptions',
    component: AdoptionListComponent
  },
  {
    path: 'my-donations',
    component: DonationListComponent
  },
  {
    path: 'map',
    component: MapComponent
  },
  {
    path: 'new-donation',
    component: AddDonationComponent
  },
  {
    path: 'all/users',
    component: AllUserAccountsComponent
  },
  {
    path: 'all/users/org',
    component: AllUserOrgAccountsComponent
  },
  {
    path: 'contact-us',
    component: ContactDetailsComponent
  },
  {
    path: 'all/organizations',
    component: OrganizationsListComponent
  },
  {
    path: 'org/details/:id',
    component: OrgDetailsComponent
  },
  {
    path: 'manage-animals',
    component: ManageAnimalsComponent
  },
  {
    path: 'org-history',
    component: OrgBenefitsHistoryComponent
  },
  {
    path:'animal/details/:id',
    component: AnimalDetailComponent
  },
  {
    path: 'adoption/:id',
    component: AdoptionProcessComponent
  },
  {
    path: 'foods',
    component: FoodsListComponent
  },
  {
    path: 'accessories',
    component: AccessoryListComponent
  },
  {
    path: 'accessories/:id',
    component: AccessoryDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
