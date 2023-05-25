import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Adoption } from '../models/adoption';
import { AdoptionsService } from '../services/adoptions.service';
import { AnimalService } from '../services/animal.service';
import { OrgService } from '../services/org.service';
import { UploadFileService } from '../services/upload-file.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-animal-detail',
  templateUrl: './animal-detail.component.html',
  styleUrls: ['./animal-detail.component.css']
})
export class AnimalDetailComponent implements OnInit {

  animalId: string;
  currentAnimal: any;
  hasCurrentAdoption: boolean;
  picturesFilePaths: string[] = [];
  currentUserValue: any;
  currentOrgValue: any;
  displayErrorAlert: boolean = false;
  errors = null;
  detailsNotCompleteUser: boolean = false;

  constructor(private route: ActivatedRoute, private userService: UserService, private orgService: OrgService, private uploadService: UploadFileService, private router: Router, public adoptionService: AdoptionsService, public animalService: AnimalService, public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.animalId = this.route.snapshot.paramMap.get('id');
    this.currentOrgValue = this.orgService.currentOrgValue;
    this.currentUserValue = this.userService.currentUserValue;
    this.animalService.getAnimal(this.animalId).subscribe(res => {
      console.log(res);
      let temp: any;
      console.log(res);
      temp = Object.assign({}, res);
      temp.addedAtString = this.datepipe.transform(res.addedAt, 'yyyy-MM-dd');
      this.currentAnimal = temp;
      console.log(this.currentAnimal);
    });
    this.adoptionService.checkExistingAdoptionForAnimal(this.animalId).subscribe(res => {
      this.hasCurrentAdoption = res;
      console.log(res);
    })
    this.uploadService.getImageNames(this.animalId).subscribe(res => {
      this.picturesFilePaths = res;
      console.log(res);
    })

    if ( this.userService.currentUserValue != null ) {
      if (this.userService.currentUserValue.cnp == 0 || this.userService.currentUserValue.address == "" || this.userService.currentUserValue.birthdate == null ||
        this.userService.currentUserValue.email == "" || this.userService.currentUserValue.phone == "") {
          this.detailsNotCompleteUser = true;
      }
  }
  console.log(this.detailsNotCompleteUser);
}

  goBackToOrg() {
    this.router.navigateByUrl("/org/details/"+this.currentAnimal.orgId);
  }

  createAdoption() {
    this.adoptionService.createAdoptionRequest(<Adoption>{
      closedAt: null,
      documentPath: "",
      animalId: this.animalId,
      userId: this.currentUserValue.id,
      statusRequest: "new"
    }).subscribe({ next: created => {
      console.log(created);
      this.router.navigateByUrl("/adoption/"+created.id);
    },
    error: error => {
      this.errors = error;
      this.displayErrorAlert = true;
      setTimeout(()=>{this.displayErrorAlert = false;}, 5000);
    }}) 
  }
}
