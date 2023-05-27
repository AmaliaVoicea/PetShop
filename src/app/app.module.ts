import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserService } from './services/user.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrgService } from './services/org.service';
import { JwtInterceptor } from './services/jwt.interceptor';
import { MyAccountComponent } from './my-account/my-account.component';
import { HomeComponent } from './home/home.component';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AdoptionListComponent } from './adoption-list/adoption-list.component';
import { DonationListComponent } from './donation-list/donation-list.component';
import { AllUserAccountsComponent } from './all-user-accounts/all-user-accounts.component';
import { AllUserOrgAccountsComponent } from './all-user-org-accounts/all-user-org-accounts.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { AddDonationComponent } from './add-donation/add-donation.component';
import { MapComponent } from './map/map.component';
import { OrganizationsListComponent } from './organizations-list/organizations-list.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { ModalComponent } from './modal/modal.component';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { AgmCoreModule } from '@agm/core';
import { DatePipe } from '@angular/common';
import { OrgDetailsComponent } from './org-details/org-details.component';
import { PipeRemoveWhitespacesPipe } from './pipe-remove-whitespaces.pipe';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { ManageAnimalsComponent } from './manage-animals/manage-animals.component';
import { AnimalService } from './services/animal.service';
import { FeedbackService } from './services/feedback.service';
import { AdoptionsService } from './services/adoptions.service';
import { AddAnimalModalComponent } from './add-animal-modal/add-animal-modal.component';
import { OrgBenefitsHistoryComponent } from './org-benefits-history/org-benefits-history.component';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import { AnimalDetailComponent } from './animal-detail/animal-detail.component';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BarRatingModule } from "ngx-bar-rating";
import { ToastrModule } from 'ngx-toastr';
import { FileUploadModule } from 'ng2-file-upload';
import { AdoptionProcessComponent } from './adoption-process/adoption-process.component';
import { NgWizardModule, NgWizardConfig, THEME } from 'ng-wizard';
import { FoodDetailsComponent } from './food-details/food-details.component';
import { AdoptionContractFormComponent } from './adoption-contract-form/adoption-contract-form.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FoodsListComponent } from './foods-list/foods-list.component';
import { FoodService } from './services/food.service';
import { FarmacyProductsComponent } from './farmacy-products/farmacy-products.component';
import { FarmacyService } from './services/farmacy.service';
import { AccessoryListComponent } from './accessory-list/accessory-list.component';
import { AccessoryService } from './services/accessory.service';
import { AccessoryDetailsComponent } from './accessory-details/accessory-details.component';

const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ConfirmationComponent,
    NavbarComponent,
    DashboardComponent,
    MyAccountComponent,
    FoodDetailsComponent,
    HomeComponent,
    EditProfileComponent,
    AdoptionListComponent,
    DonationListComponent,
    AllUserAccountsComponent,
    AllUserOrgAccountsComponent,
    ContactDetailsComponent,
    AddDonationComponent,
    MapComponent,
    OrganizationsListComponent,
    ModalComponent,
    OrgDetailsComponent,
    PipeRemoveWhitespacesPipe,
    ConfirmationModalComponent,
    ManageAnimalsComponent,
    AddAnimalModalComponent,
    OrgBenefitsHistoryComponent,
    DeleteConfirmationDialogComponent,
    AnimalDetailComponent,
    AdoptionProcessComponent,
    AdoptionContractFormComponent,
    FoodsListComponent,
    FarmacyProductsComponent,
    AccessoryListComponent,
    AccessoryDetailsComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyChIUT46PIoh-NZjKeAzmLJPtyrc99l5RA'
    }),
    NgxPayPalModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    Ng2SearchPipeModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CarouselModule,
    ButtonModule,
    NgWizardModule.forRoot(ngWizardConfig),
    MdbModalModule,
    NgxStarRatingModule,
    NgbModule,
    BarRatingModule,
    FileUploadModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    JwtModule.forRoot({
      config: {
        //blacklistedRoutes: []
      }
    }),
    MDBBootstrapModule.forRoot(),
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
  ],
  providers: [
    DatePipe,
    UserService,
    OrgService,
    AnimalService,
    FeedbackService,
    AdoptionsService,
    FoodService,
    FarmacyService,
    AccessoryService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
