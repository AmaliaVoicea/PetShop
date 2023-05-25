import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { Org } from '../models/org';
import { OrgService } from '../services/org.service';
import { ModalComponent } from '../modal/modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { UserService } from '../services/user.service';
import { DonationService } from '../services/donation.service';
import { Donation } from '../models/donation';

@Component({
  selector: 'app-add-donation',
  templateUrl: './add-donation.component.html',
  styleUrls: ['./add-donation.component.css']
})

export class AddDonationComponent implements OnInit {
  constructor(public orgService: OrgService, public userService: UserService, private formBuilder: FormBuilder, private modalService: MdbModalService, private donationService: DonationService) { }

  public payPalConfig ? : IPayPalConfig;
  public loggedIn: boolean = false;
  donationForm: FormGroup;
  public orgsList: Org[] =[];
  public ngDropdownValue: string;
  public orgToDonate: Org;
  modalRef: MdbModalRef<ModalComponent> | null = null;

  ngOnInit(): void {
    if (this.userService.currentUserValue != null) {
      this.loggedIn = true;
    }
    this.donationForm = this.formBuilder.group({
      selectAmountFormControl: ['', Validators.required],
      selectOrgFormControl: ['', Validators.required]
    });
    this.orgService.getAllOrgs().subscribe(orgs => {
      console.log(orgs)
      orgs.forEach( (elem) => {
        if (elem.payPalAccount != null) {
          this.orgsList.push(elem);
        }
      })
    });
  }

  get f() { return this.donationForm.controls; }

  setValues(){
    this.orgService.getOrgByName(this.f['selectOrgFormControl'].value).subscribe(res=>{
      console.log(res)
      this.orgToDonate = res;
      console.log(res);
      this.initConfig(this.orgToDonate.payPalAccount);
    });
  }

  public initConfig(paypalAccount: string): void {
      this.payPalConfig = {
          currency: 'USD',
          clientId: 'sb',
          createOrderOnClient: (data) => < ICreateOrderRequest > {
              intent: 'CAPTURE',
              purchase_units: [{
                  amount: {
                      currency_code: 'USD',
                      value: this.f['selectAmountFormControl'].value,
                  },
                  "payee":{
                    "email_address": paypalAccount,
                },
              }]
          },
          advanced: {
              commit: 'true'
          },
          style: {
              label: 'paypal',
              layout: 'vertical'
          },
          onApprove: (data, actions) => {
              console.log('onApprove - transaction was approved, but not authorized', data, actions);
              actions.order.get().then(details => {
                  console.log('onApprove - you can get full order details inside onApprove: ', details);
              });

          },
          onClientAuthorization: (data) => {
              console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);

              this.modalRef = this.modalService.open(ModalComponent, {
                data: { title: 'Success',
                        body: 'Your donation was completed. Thank you for donating! The organization will receive the money soon.' },
              });
          
              this.donationService.AddDonation(<Donation>{ amount : this.f['selectAmountFormControl'].value,
                ongId : this.orgToDonate.id,
                userId : null,
                donationDate : null}).subscribe()
            //  this.showSuccess = true;

          },
          onCancel: (data, actions) => {
              console.log('OnCancel', data, actions);
              this.modalRef = this.modalService.open(ModalComponent, {
                data: { title: 'Failure',
                        body: 'We are sorry, but the donation process was not completed successfully. Please try again. If this error persists, please contact our administrator via the contact form.' },
              });
            //  this.showCancel = true;

          },
          onError: err => {
              console.log('OnError', err);
              this.modalRef = this.modalService.open(ModalComponent, {
                data: { title: 'Failure',
                        body: 'We are sorry, but the donation process was not completed successfully. Please try again. If this error persists, please contact our administrator via the contact form.' },
              });
           //   this.showError = true;
          },
          onClick: (data, actions) => {
              console.log('onClick', data, actions);
            //  this.resetStatus();
          }
      };
  }
}
