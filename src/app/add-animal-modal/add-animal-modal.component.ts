import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Animal } from '../models/animal';
import { AnimalService } from '../services/animal.service';
import { UploadFileService } from '../services/upload-file.service';

const URL = environment.apiEndpoint + 'api/upload';

@Component({
  selector: 'app-add-animal-modal',
  templateUrl: './add-animal-modal.component.html',
  styleUrls: ['./add-animal-modal.component.css']
})
export class AddAnimalModalComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: 'image',
  });
  picturesLoaded: boolean = false;
  ngOnInit(): void {
    this.initializeForm();
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      this.picturesLoaded = true;
      setTimeout(()=>{this.picturesLoaded = false;}, 3000);
    };
    this.uploader.onCompleteItem = (item: any, status: any) => {
      console.log('Uploaded File Details:', item);
      this.toastr.success('File successfully uploaded!');
    };
  }

  addAnimalForm: FormGroup;
  animalType: string;
  animalGender: string;
  checkVaccinated = false;
  checkSterilised = false;
  checkSpecialTreatment = false;
  otherErrorsDiv = null;
  displaySuccessAlert = false;
  displayErrorAlert = false;
  displayUpdateSuccessAlert = false;
  displayUpdateErrorAlert = false;
  errors = null;
  dataToUpdate: Animal | null = null;
  editFlag: boolean | null = null;

  constructor(private animalService : AnimalService, private uploadService: UploadFileService, private fb: FormBuilder, private scroll: ViewportScroller, public modalRef: MdbModalRef<AddAnimalModalComponent>, private toastr: ToastrService) {}

  initializeForm() {
    if(this.editFlag == true && this.dataToUpdate != null) {
      this.addAnimalForm = this.fb.group({
          name: [this.dataToUpdate.name,Validators.required],
          type: [this.dataToUpdate.type, Validators.required],
          description: [this.dataToUpdate.description],
          gender: [this.dataToUpdate.gender, Validators.required],
          age: [this.dataToUpdate.age, Validators.required],
          vaccinated: [this.dataToUpdate.vaccinated],
          sterilised: [this.dataToUpdate.sterilised],
          specialTreatment: [this.dataToUpdate.specialTreatment]
        });
    } else if(this.editFlag == false  && this.dataToUpdate == null) {
      this.addAnimalForm = this.fb.group({
      //if in linie direct pe variabila ca sa nu te mai chinui ex: flag== true ? data.camp: ''
        name: ['',Validators.required],
        type: ['', Validators.required],
        description: [''],
        gender: ['', Validators.required],
        age: [0, Validators.required],
        vaccinated: [this.checkVaccinated],
        sterilised: [this.checkSterilised],
        specialTreatment: [this.checkSpecialTreatment]
      });
    }
  }

  get f() { return this.addAnimalForm.controls; }

  createAnimal() {
    console.log("Aici")
    this.otherErrorsDiv = null;
    this.addAnimalForm.markAllAsTouched();
    let shouldReturn = false;

    if (this.addAnimalForm.invalid) {
      shouldReturn = true;
    }

    if(shouldReturn) return;
    console.log(this.addAnimalForm.valid)
    this.addAnimalForm.patchValue({vaccinated: this.checkVaccinated, sterilised: this.checkSterilised, specialTreatment: this.checkSpecialTreatment});
    if(this.addAnimalForm.valid) {
      this.animalService.addNewAnimal(<Animal>{
        name: this.f['name'].value,
        type: this.f['type'].value,
        description: this.f['description'].value,
        gender: this.f['gender'].value,
        age: this.f['age'].value,
        vaccinated: this.f['vaccinated'].value,
        sterilised: this.f['sterilised'].value,
        specialTreatment: this.f['specialTreatment'].value
      }).subscribe({next: createResponse => {
        this.uploadFiles(createResponse.id);
        this.displaySuccessAlert = true;
        this.scroll.scrollToPosition([0,0]);
        setTimeout(()=>{this.modalRef.close(); this.displaySuccessAlert = false; window.location.reload();}, 5000);
      },
      error: error => {
        this.errors = error;
        this.displayErrorAlert = true;
        this.scroll.scrollToPosition([0,0]);
        setTimeout(()=>{this.displayErrorAlert = false;}, 5000);
      }})
    }
  }

  editAnimal() {
    this.otherErrorsDiv = null;
    this.addAnimalForm.markAllAsTouched();
    let shouldReturn = false;

    if (this.addAnimalForm.invalid) {
      shouldReturn = true;
    }

    if(shouldReturn) return;
    console.log(this.addAnimalForm.valid)
    this.addAnimalForm.patchValue({vaccinated: this.dataToUpdate.vaccinated, sterilised: this.dataToUpdate.sterilised, specialTreatment:this.dataToUpdate.specialTreatment});
    if(this.addAnimalForm.valid) {
      this.animalService.updateAnimalInfo(<Animal>{
        id: this.dataToUpdate.id,
        name: this.f['name'].value,
        type: this.f['type'].value,
        description: this.f['description'].value,
        gender: this.f['gender'].value,
        age: this.f['age'].value,
        vaccinated: this.f['vaccinated'].value,
        sterilised: this.f['sterilised'].value,
        specialTreatment: this.f['specialTreatment'].value
      }).subscribe({next: createResponse => {
        console.log(createResponse);
        this.displayUpdateSuccessAlert = true;
        this.scroll.scrollToPosition([0,0]);
        setTimeout(()=>{this.modalRef.close(); this.displayUpdateSuccessAlert = false;}, 5000);
        window.location.reload();
      },
      error: error => {
        this.errors = error;
        this.displayUpdateErrorAlert = true;
        this.scroll.scrollToPosition([0,0]);
        setTimeout(()=>{this.displayErrorAlert = false;}, 5000);
      }})
    }
  }

  checkInput(input: any){
    return input.invalid && (input.dirty || input.touched);
  }

  checkboxVaccinated(event){
    if(this.editFlag == false) this.checkVaccinated = event.checked;
    else this.dataToUpdate.vaccinated = event.checked;
  }

  checkboxSterilised(e){
    if(this.editFlag == false) this.checkSterilised = e.checked;
    else this.dataToUpdate.sterilised = e.checked;
  }

  checkboxSpecialTreatment(ev){
    if(this.editFlag == false) this.checkSpecialTreatment = ev.checked;
    else this.dataToUpdate.specialTreatment = ev.checked;
  }

  uploadFiles(id: string) {
    console.log(this.uploader.queue);
    let files: any[] = [];
    this.uploader.queue.forEach((elem) => {
      files.push(elem._file);
    })
    console.log(files)
    this.uploadService.uploadFiles(files, id).subscribe(res => {
      this.uploader.clearQueue;
    })
  }
}
