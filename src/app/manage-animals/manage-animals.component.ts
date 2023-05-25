import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Animal } from '../models/animal';
import { AnimalService } from '../services/animal.service';
import { OrgService } from '../services/org.service';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { AddAnimalModalComponent } from '../add-animal-modal/add-animal-modal.component';
import { ModalComponent } from '../modal/modal.component';
import { DatePipe } from '@angular/common';
import { AdoptionsService } from '../services/adoptions.service';

@Component({
  selector: 'app-manage-animals',
  templateUrl: './manage-animals.component.html',
  styleUrls: ['./manage-animals.component.css']
})
export class ManageAnimalsComponent implements OnInit {

  allAnimals: Animal[] = [];
  modalRef: MdbModalRef<AddAnimalModalComponent> | null = null;
  temporaryObject: any[] = [];
  successfullyDeletedAnimal: boolean = false;
  

  constructor(private adoptionService: AdoptionsService, private orgService: OrgService, private modalService: MdbModalService, private animalService: AnimalService, private router: Router, private datePipe: DatePipe) { }

  ngOnInit(): void {
    var org = this.orgService.GetOrgData();
    console.log(org);
    this.animalService.getAllAnimalsFromOrg(org.id).subscribe(res => {
      let temp: any;
      this.allAnimals = res;
      res.forEach((elem) =>{
        temp = Object.assign({}, elem);
        temp.addedAtString = this.datePipe.transform(elem.addedAt, 'yyyy-MM-dd');
        temp.hasCurrentAdoption = null;
        this.adoptionService.checkExistingAdoptionForAnimal(elem.id).subscribe(res => {
          temp.hasCurrentAdoption = res;
          console.log(res);
        })
        console.log(temp);
        this.temporaryObject.push(temp);
      });
    });
    this.cloneObject();
  }

  cloneObject() {
    let temp: any;
    this.allAnimals.forEach((elem) =>{
      temp = Object.assign({}, elem);
      temp.addedAtString = this.datePipe.transform(elem.addedAt, 'yyyy-MM-dd');
      this.temporaryObject.push(elem);
    });
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

  goToMyActivity() {
    this.router.navigateByUrl("my-adoptions");
  }

  goToManageAnimals() {
    this.router.navigateByUrl("manage-animals");
  }

  goToOrgBenefits() {
    this.router.navigateByUrl("org-history");
  }
  
  openModal() {
    this.modalService.open(AddAnimalModalComponent, {
      data: {editFlag: false}
    });
  }

  editAnimalRow(i: number){
    let a = this.allAnimals[i];
    this.modalRef = this.modalService.open(AddAnimalModalComponent, {
      data: { dataToUpdate: a,
              editFlag: true }
    });
  }

  deleteAnimalRow(i: number) {
    let a = this.allAnimals[i];
    this.animalService.deleteAnimal(a.id).subscribe(r => {
      this.successfullyDeletedAnimal = true;
      setTimeout(()=>{this.successfullyDeletedAnimal = false; window.location.reload();}, 3000);
    });
  }

}
