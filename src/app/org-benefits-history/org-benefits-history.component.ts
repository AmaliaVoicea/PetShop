import { DatePipe } from '@angular/common';
import { temporaryAllocator } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Adoption } from '../models/adoption';
import { Donation } from '../models/donation';
import { AdoptionsService } from '../services/adoptions.service';
import { DonationService } from '../services/donation.service';
import { OrgService } from '../services/org.service';

@Component({
  selector: 'app-org-benefits-history',
  templateUrl: './org-benefits-history.component.html',
  styleUrls: ['./org-benefits-history.component.css']
})
export class OrgBenefitsHistoryComponent implements OnInit {

  orgDonations: Donation[] = [];
  orgAdoptions: Adoption[] = [];
  orgAdoptionsDonations: any[] = [];
  status = "closed - accepted";
  constructor(private adoptionsService: AdoptionsService, private orgService: OrgService, private router: Router, private donationsService: DonationService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.adoptionsService.getAllAdoptionsForOrgByStatus(this.status).subscribe(res => {
      let temp: any;
      this.orgAdoptions = res;
      console.log(res);
      res.forEach((elem) => {
        temp = Object.assign({}, elem);
        temp.date = this.datePipe.transform(elem.closedAt, 'yyyy-MM-dd');
        temp.type = "adoption";
        this.orgAdoptionsDonations.push(temp);
      });
      this.donationsService.getAllDonationsByOrgId().subscribe(res => {
        this.orgDonations = res;
        console.log(res);
        res.forEach((elem) => {
          temp = Object.assign({}, elem);
          temp.date = this.datePipe.transform(elem.donationDate, 'yyyy-MM-dd');
          temp.type = "donation";
          this.orgAdoptionsDonations.push(temp);
        })
      });
    });
    this.orgAdoptionsDonations.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  signOut(){
    if (this.orgService.currentOrgValue != null) {
      this.orgService.LogoutOrgUser().subscribe(resp => {});
    }
    this.router.navigateByUrl("/home");
  }

  goToMyProfile() {
    this.router.navigateByUrl("/edit-profile");
  }

  goToManageAnimals() {
    this.router.navigateByUrl("manage-animals");
  }

  goToOrgBenefits() {
    this.router.navigateByUrl("org-history");
  }

  openContract(adoptionId: string) {
    window.open("./../../assets/documents/adoptions/"+adoptionId + ".html", '_blank')
  }

}
